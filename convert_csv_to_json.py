import csv
import json
import re
from pathlib import Path

def parse_course_info(course_text):
    """Parse course information from the CSV text format"""
    if not course_text or course_text.strip() == "":
        return None

    # Extract course code and title from the beginning
    # Handle both DIGF-1003 and DIGF1003 formats, with or without "Credits"
    course_match = re.match(r'^([A-Z]{4}-?\d{4})\s+(.+?)\s*\(([\d.]+)\s*(?:Credits?)?\)', course_text.strip())
    if course_match:
        course_code = course_match.group(1)
        course_title = course_match.group(2).strip()
        credits = float(course_match.group(3))

        # Remove the course code, title, and credits from the text to get description
        description_text = re.sub(r'^[A-Z]{4}-?\d{4}\s+.+\s*\([\d.]+\s*(?:Credits?)?\)\s*', '', course_text.strip())

        # Extract prerequisites if they exist
        prereq_match = re.search(r'Requisites?:\s*(.+?)(?:\n|$)', description_text, re.DOTALL)
        prerequisites = prereq_match.group(1).strip() if prereq_match else None

        # Clean up description by removing prerequisites section
        description = re.sub(r'Requisites?:\s*.+$', '', description_text, flags=re.MULTILINE).strip()

        return {
            "code": course_code,
            "title": course_title,
            "credits": credits,
            "description": description,
            "prerequisites": prerequisites
        }

    return None

def parse_csv_to_json(csv_file_path, pathway_name):
    """Parse CSV file and convert to structured JSON"""
    courses_data = {
        "name": pathway_name.replace('-', ' ').title(),
        "years": {}
    }

    with open(csv_file_path, 'r', encoding='latin-1') as file:
        reader = csv.reader(file)
        rows = list(reader)

        current_year = None
        current_semester = None

        for row in rows:
            # Skip empty rows
            if not any(cell.strip() for cell in row):
                continue

            # Look for year headers
            year_match = re.match(r'YEAR (\d)', row[1])
            if year_match:
                current_year = year_match.group(1)
                if current_year not in courses_data["years"]:
                    courses_data["years"][current_year] = {
                        "fall": {
                            "core_courses": [],
                            "program_specific_electives": [],
                            "open_electives": [],
                            "breadth_electives": []
                        },
                        "winter": {
                            "core_courses": [],
                            "program_specific_electives": [],
                            "open_electives": [],
                            "breadth_electives": []
                        }
                    }
                
                # Check if this same row also has semester info
                semester_match = re.match(r'Semester (\d) \((\w+)\)', row[2])
                if semester_match:
                    semester_name = semester_match.group(2).lower()
                    current_semester = semester_name
                
                # Process courses in this row if semester is set
                if current_semester and len(row) >= 7:
                    semester_data = courses_data["years"][current_year][current_semester]
                    
                    # Core Courses (column 3)
                    if len(row) > 3 and row[3] and row[3].strip():
                        course = parse_course_info(row[3])
                        if course:
                            semester_data["core_courses"].append(course)

                    # Program-Specific Electives (column 4)
                    if len(row) > 4 and row[4] and row[4].strip():
                        course = parse_course_info(row[4])
                        if course:
                            semester_data["program_specific_electives"].append(course)

                    # Open Electives (column 5)
                    if len(row) > 5 and row[5] and row[5].strip():
                        course = parse_course_info(row[5])
                        if course:
                            semester_data["open_electives"].append(course)

                    # Breadth Electives (column 6)
                    if len(row) > 6 and row[6] and row[6].strip():
                        course = parse_course_info(row[6])
                        if course:
                            semester_data["breadth_electives"].append(course)
                
                continue

            # Look for semester headers (in rows that don't have year headers)
            semester_match = re.match(r'Semester (\d) \((\w+)\)', row[2])
            if semester_match and current_year:
                semester_name = semester_match.group(2).lower()
                current_semester = semester_name
                
                # Process courses in this same row if they exist
                if len(row) >= 7:
                    semester_data = courses_data["years"][current_year][current_semester]
                    
                    # Core Courses (column 3)
                    if len(row) > 3 and row[3] and row[3].strip():
                        course = parse_course_info(row[3])
                        if course:
                            semester_data["core_courses"].append(course)

                    # Program-Specific Electives (column 4)
                    if len(row) > 4 and row[4] and row[4].strip():
                        course = parse_course_info(row[4])
                        if course:
                            semester_data["program_specific_electives"].append(course)

                    # Open Electives (column 5)
                    if len(row) > 5 and row[5] and row[5].strip():
                        course = parse_course_info(row[5])
                        if course:
                            semester_data["open_electives"].append(course)

                    # Breadth Electives (column 6)
                    if len(row) > 6 and row[6] and row[6].strip():
                        course = parse_course_info(row[6])
                        if course:
                            semester_data["breadth_electives"].append(course)
                
                continue

            # Process course data if we have a current semester
            if current_year and current_semester and len(row) >= 7:
                semester_data = courses_data["years"][current_year][current_semester]
                
                # Core Courses (column 3)
                if len(row) > 3 and row[3] and row[3].strip():
                    course = parse_course_info(row[3])
                    if course:
                        semester_data["core_courses"].append(course)

                # Program-Specific Electives (column 4)
                if len(row) > 4 and row[4] and row[4].strip():
                    course = parse_course_info(row[4])
                    if course:
                        semester_data["program_specific_electives"].append(course)

                # Open Electives (column 5)
                if len(row) > 5 and row[5] and row[5].strip():
                    course = parse_course_info(row[5])
                    if course:
                        semester_data["open_electives"].append(course)

                # Breadth Electives (column 6)
                if len(row) > 6 and row[6] and row[6].strip():
                    course = parse_course_info(row[6])
                    if course:
                        semester_data["breadth_electives"].append(course)

    return courses_data

def create_comparison_json(pathways_data):
    """Create a comparison JSON that makes it easy to compare across pathways"""
    comparison_data = {
        "program": "Digital Futures",
        "academic_year": "2025/26",
        "pathways": list(pathways_data.keys()),
        "comparison": {
            "by_year": {},
            "by_course_type": {},
            "all_courses": []
        }
    }

    # Collect all unique courses
    all_courses = set()

    for pathway_name, pathway_data in pathways_data.items():
        for year, year_data in pathway_data["years"].items():
            if year not in comparison_data["comparison"]["by_year"]:
                comparison_data["comparison"]["by_year"][year] = {
                    "fall": {
                        "core_courses": {},
                        "program_specific_electives": {},
                        "open_electives": {},
                        "breadth_electives": {}
                    },
                    "winter": {
                        "core_courses": {},
                        "program_specific_electives": {},
                        "open_electives": {},
                        "breadth_electives": {}
                    }
                }

            for semester, semester_data in year_data.items():
                for course_type, courses in semester_data.items():
                    for course in courses:
                        course_key = f"{course['code']}: {course['title']}"
                        all_courses.add(course_key)

                        # Add to year comparison
                        if course_key not in comparison_data["comparison"]["by_year"][year][semester][course_type]:
                            comparison_data["comparison"]["by_year"][year][semester][course_type][course_key] = []

                        comparison_data["comparison"]["by_year"][year][semester][course_type][course_key].append(pathway_name)

                        # Add to course type comparison
                        if course_type not in comparison_data["comparison"]["by_course_type"]:
                            comparison_data["comparison"]["by_course_type"][course_type] = {}

                        if course_key not in comparison_data["comparison"]["by_course_type"][course_type]:
                            comparison_data["comparison"]["by_course_type"][course_type][course_key] = {
                                "details": course,
                                "offered_in": []
                            }

                        if pathway_name not in comparison_data["comparison"]["by_course_type"][course_type][course_key]["offered_in"]:
                            comparison_data["comparison"]["by_course_type"][course_type][course_key]["offered_in"].append(pathway_name)

    # Convert set to sorted list
    comparison_data["comparison"]["all_courses"] = sorted(list(all_courses))

    return comparison_data

def main():
    """Main function to convert CSV files to JSON"""
    csv_files = {
        "creative-technologist": "baseFiles/DF UG_StudentPathways.csv",
        "physical-interface-designer": "baseFiles/DF UG_StudentPathways2.csv",
        "games-playable-media-maker": "baseFiles/DF UG_StudentPathways3.csv"
    }

    pathways_data = {}

    # Convert each CSV to individual JSON
    for pathway_name, csv_path in csv_files.items():
        print(f"Processing {pathway_name}...")
        json_data = parse_csv_to_json(csv_path, pathway_name)
        pathways_data[pathway_name] = json_data

        # Save individual pathway JSON
        output_path = f"{pathway_name}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)

        print(f"Saved {output_path}")

    # Create comparison JSON
    print("Creating comparison data...")
    comparison_data = create_comparison_json(pathways_data)

    # Save comparison JSON
    with open("pathway-comparison.json", 'w', encoding='utf-8') as f:
        json.dump(comparison_data, f, indent=2, ensure_ascii=False)

    print("Saved pathway-comparison.json")

    # Create searchable index
    print("Creating searchable index...")
    searchable_index = {
        "program": "Digital Futures",
        "last_updated": "2025-09-02",
        "search_index": {
            "courses_by_code": {},
            "courses_by_title": {},
            "courses_by_keywords": {},
            "courses_by_pathway": {},
            "courses_by_year": {},
            "courses_by_course_type": {}
        }
    }

    for pathway_name, pathway_data in pathways_data.items():
        searchable_index["search_index"]["courses_by_pathway"][pathway_name] = []

        for year, year_data in pathway_data["years"].items():
            if year not in searchable_index["search_index"]["courses_by_year"]:
                searchable_index["search_index"]["courses_by_year"][year] = []

            for semester, semester_data in year_data.items():
                for course_type, courses in semester_data.items():
                    if course_type not in searchable_index["search_index"]["courses_by_course_type"]:
                        searchable_index["search_index"]["courses_by_course_type"][course_type] = []

                    for course in courses:
                        course_info = {
                            "code": course["code"],
                            "title": course["title"],
                            "credits": course["credits"],
                            "description": course["description"],
                            "prerequisites": course["prerequisites"],
                            "pathway": pathway_name,
                            "year": year,
                            "semester": semester,
                            "course_type": course_type
                        }

                        # Index by course code
                        searchable_index["search_index"]["courses_by_code"][course["code"]] = course_info

                        # Index by title keywords
                        title_words = course["title"].lower().split()
                        for word in title_words:
                            if len(word) > 2:  # Skip very short words
                                if word not in searchable_index["search_index"]["courses_by_title"]:
                                    searchable_index["search_index"]["courses_by_title"][word] = []
                                searchable_index["search_index"]["courses_by_title"][word].append(course_info)

                        # Index by description keywords
                        desc_words = course["description"].lower().split()
                        for word in desc_words:
                            if len(word) > 3:  # Skip short words
                                if word not in searchable_index["search_index"]["courses_by_keywords"]:
                                    searchable_index["search_index"]["courses_by_keywords"][word] = []
                                searchable_index["search_index"]["courses_by_keywords"][word].append(course_info)

                        # Add to pathway list
                        searchable_index["search_index"]["courses_by_pathway"][pathway_name].append(course_info)

                        # Add to year list
                        searchable_index["search_index"]["courses_by_year"][year].append(course_info)

                        # Add to course type list
                        searchable_index["search_index"]["courses_by_course_type"][course_type].append(course_info)

    # Save searchable index
    with open("searchable-index.json", 'w', encoding='utf-8') as f:
        json.dump(searchable_index, f, indent=2, ensure_ascii=False)

    print("Saved searchable-index.json")
    print("Conversion complete!")

if __name__ == "__main__":
    main()
