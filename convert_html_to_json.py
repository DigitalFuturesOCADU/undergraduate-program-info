import json
import re
from bs4 import BeautifulSoup

def parse_html_to_json(html_file_path):
    """Parse the HTML file and extract course data into structured JSON format."""

    with open(html_file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    soup = BeautifulSoup(html_content, 'html.parser')

    pathways_data = {}

    # Find all pathway sections
    pathway_sections = soup.find_all('section', class_='pathway-section')

    for section in pathway_sections:
        pathway_name = section.get('id')
        if not pathway_name:
            continue

        pathways_data[pathway_name] = {
            'name': section.find('h2').get_text().replace(' +', '').strip(),
            'years': {}
        }

        # Find all course types within this pathway
        course_types = section.find_all('div', class_='course-type')

        for course_type_div in course_types:
            course_type = course_type_div.find('h4').get_text().lower().replace(' ', '_')

            # Find all year columns
            year_columns = course_type_div.find_all('div', class_='year-column')

            for year_col in year_columns:
                year_header = year_col.find('h5')
                if not year_header:
                    continue

                year_text = year_header.get_text().strip()
                # Extract year number (e.g., "Year 1 (5 Credits)" -> "1")
                year_match = re.search(r'Year (\d+)', year_text)
                if not year_match:
                    continue

                year_num = year_match.group(1)

                if year_num not in pathways_data[pathway_name]['years']:
                    pathways_data[pathway_name]['years'][year_num] = {}

                if course_type not in pathways_data[pathway_name]['years'][year_num]:
                    pathways_data[pathway_name]['years'][year_num][course_type] = []

                # Find all courses in this year
                course_items = year_col.find_all('li')

                for course_item in course_items:
                    summary = course_item.find('summary')
                    if not summary:
                        continue

                    course_title = summary.get_text().strip()

                    # Extract course code, title, and credits using regex
                    course_match = re.match(r'([A-Z]+-\d+[A-Z]*)\s+(.+?)\s*\(([\d.]+)\s+Credits?\)', course_title)
                    if course_match:
                        course_code = course_match.group(1)
                        course_name = course_match.group(2)
                        credits = float(course_match.group(3))
                    else:
                        # Fallback for courses without standard format
                        course_code = ""
                        course_name = course_title
                        credits = 0.0

                    # Get course description
                    description_elem = course_item.find('p')
                    description = description_elem.get_text().strip() if description_elem else ""

                    course_data = {
                        'code': course_code,
                        'title': course_name,
                        'credits': credits,
                        'description': description
                    }

                    pathways_data[pathway_name]['years'][year_num][course_type].append(course_data)

    return pathways_data

def create_comparison_json(pathways_data):
    """Create a comparison JSON that shows courses across all pathways."""

    comparison_data = {
        'pathways': list(pathways_data.keys()),
        'comparison': {}
    }

    # Collect all unique course codes
    all_courses = set()
    for pathway, data in pathways_data.items():
        for year, year_data in data['years'].items():
            for course_type, courses in year_data.items():
                for course in courses:
                    if course['code']:
                        all_courses.add(course['code'])

    # Build comparison structure
    for course_code in sorted(all_courses):
        comparison_data['comparison'][course_code] = {}

        for pathway in pathways_data.keys():
            comparison_data['comparison'][course_code][pathway] = []

            # Find this course in the pathway
            for year, year_data in pathways_data[pathway]['years'].items():
                for course_type, courses in year_data.items():
                    for course in courses:
                        if course['code'] == course_code:
                            comparison_data['comparison'][course_code][pathway].append({
                                'year': year,
                                'type': course_type,
                                'title': course['title'],
                                'credits': course['credits'],
                                'description': course['description']
                            })

    return comparison_data

def create_searchable_index(pathways_data):
    """Create a searchable index of all courses."""

    index_data = {
        'courses': {},
        'keywords': {}
    }

    course_id = 1
    for pathway, data in pathways_data.items():
        for year, year_data in data['years'].items():
            for course_type, courses in year_data.items():
                for course in courses:
                    if course['code']:
                        index_data['courses'][course['code']] = {
                            'id': course_id,
                            'pathway': pathway,
                            'year': year,
                            'type': course_type,
                            'title': course['title'],
                            'credits': course['credits'],
                            'description': course['description']
                        }

                        # Extract keywords from title and description
                        text = f"{course['title']} {course['description']}".lower()
                        words = re.findall(r'\b\w+\b', text)

                        for word in words:
                            if len(word) > 2:  # Skip very short words
                                if word not in index_data['keywords']:
                                    index_data['keywords'][word] = []
                                if course['code'] not in index_data['keywords'][word]:
                                    index_data['keywords'][word].append(course['code'])

                        course_id += 1

    return index_data

def main():
    html_file = 'index.html'

    print("Parsing HTML file...")
    pathways_data = parse_html_to_json(html_file)

    # Save individual pathway files
    for pathway_name, data in pathways_data.items():
        filename = f"pathways/{pathway_name}.json"
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Saved {filename}")

    # Create and save comparison file
    print("Creating comparison data...")
    comparison_data = create_comparison_json(pathways_data)
    with open('pathways/pathway-comparison.json', 'w', encoding='utf-8') as f:
        json.dump(comparison_data, f, indent=2, ensure_ascii=False)
    print("Saved pathways/pathway-comparison.json")

    # Create and save searchable index
    print("Creating searchable index...")
    index_data = create_searchable_index(pathways_data)
    with open('pathways/searchable-index.json', 'w', encoding='utf-8') as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)
    print("Saved pathways/searchable-index.json")

    print("All JSON files created successfully!")

if __name__ == "__main__":
    main()
