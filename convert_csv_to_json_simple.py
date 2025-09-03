import json
import re

def parse_course_info(course_text):
    """Parse course information from the CSV text format"""
    if not course_text or course_text.strip() == "":
        return None

    # Extract course code and title from the beginning
    course_match = re.match(r'^([A-Z]{4}-\d{4})\s+(.+?)\s*\(([\d.]+)\s*Credits?\)', course_text.strip())
    if course_match:
        course_code = course_match.group(1)
        course_title = course_match.group(2).strip()
        credits = float(course_match.group(3))

        # Remove the course code, title, and credits from the text to get description
        description_text = re.sub(r'^[A-Z]{4}-\d{4}\s+.+\s*\([\d.]+\s*Credits?\)\s*', '', course_text.strip())

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

def parse_csv_content(content, pathway_name):
    """Parse CSV content and convert to structured JSON"""
    courses_data = {
        "pathway": pathway_name,
        "program": "Digital Futures",
        "academic_year": "2025/26",
        "total_credits": 20.0,
        "requirements": {
            "max_1000_level": 6.0,
            "min_3000_plus": 5.0,
            "min_4000_level": 1.0,
            "min_arts_sciences_3_4000": 1.5
        },
        "years": {}
    }

    lines = content.split('\n')
    current_year = None
    current_semester = None

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Skip empty lines
        if not line:
            i += 1
            continue

        # Look for year headers
        if 'YEAR' in line and ('Year 1' in line or 'Year 2' in line or 'Year 3' in line or 'Year 4' in line):
            year_match = re.search(r'Year (\d+)', line)
            if year_match:
                current_year = f"Year {year_match.group(1)}"
                courses_data["years"][current_year] = {
                    "total_credits": 5.0,
                    "semesters": {}
                }
            i += 1
            continue

        # Look for semester headers
        if 'Semester' in line:
            semester_match = re.search(r'Semester (\d+) \((\w+)\)', line)
            if semester_match and current_year:
                semester_num = semester_match.group(1)
                semester_name = semester_match.group(2)
                current_semester = f"Semester {semester_num} ({semester_name})"
                courses_data["years"][current_year]["semesters"][current_semester] = {
                    "course_types": {
                        "core": [],
                        "program_specific": [],
                        "open": [],
                        "breadth": []
                    }
                }
            i += 1
            continue

        # Process course data - look for lines containing course codes
        if current_year and current_semester and '[A-Z]{4}-' in line:
            # This might be a course line, let's collect all related lines
            course_line = line

            # Check if the next few lines are continuations (don't contain YEAR or Semester)
            j = i + 1
            while j < len(lines) and lines[j].strip() and 'YEAR' not in lines[j] and 'Semester' not in lines[j]:
                course_line += ' ' + lines[j].strip()
                j += 1

            # Try to parse courses from this line
            # Split by commas but be careful with quoted content
            parts = course_line.split('","')

            if len(parts) >= 3:
                # Core course (usually index 2)
                if len(parts) > 2:
                    core_course = parse_course_info(parts[2].strip('"'))
                    if core_course:
                        courses_data["years"][current_year]["semesters"][current_semester]["course_types"]["core"].append(core_course)

                # Program-specific course (usually index 3)
                if len(parts) > 3:
                    prog_course = parse_course_info(parts[3].strip('"'))
                    if prog_course:
                        courses_data["years"][current_year]["semesters"][current_semester]["course_types"]["program_specific"].append(prog_course)

                # Open course (usually index 4)
                if len(parts) > 4:
                    open_course = parse_course_info(parts[4].strip('"'))
                    if open_course:
                        courses_data["years"][current_year]["semesters"][current_semester]["course_types"]["open"].append(open_course)

                # Breadth course (usually index 5)
                if len(parts) > 5:
                    breadth_course = parse_course_info(parts[5].strip('"'))
                    if breadth_course:
                        courses_data["years"][current_year]["semesters"][current_semester]["course_types"]["breadth"].append(breadth_course)

            i = j
        else:
            i += 1

    return courses_data

def main():
    """Main function to convert CSV files to JSON"""
    csv_files = {
        "creative-technologist": "pathways/baseFiles/DF UG_StudentPathways.csv",
        "physical-interface-designer": "pathways/baseFiles/DF UG_StudentPathways2.csv",
        "games-playable-media-maker": "pathways/baseFiles/DF UG_StudentPathways3.csv"
    }

    pathways_data = {}

    # Convert each CSV to individual JSON
    for pathway_name, csv_path in csv_files.items():
        print(f"Processing {pathway_name}...")

        with open(csv_path, 'r', encoding='latin-1') as file:
            content = file.read()

        json_data = parse_csv_content(content, pathway_name)
        pathways_data[pathway_name] = json_data

        # Save individual pathway JSON
        output_path = f"pathways/{pathway_name}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, indent=2, ensure_ascii=False)

        print(f"Saved {output_path}")

    print("Conversion complete!")

if __name__ == "__main__":
    main()
