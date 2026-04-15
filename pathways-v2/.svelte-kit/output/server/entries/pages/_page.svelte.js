import { a4 as attr, a5 as attr_class, a6 as ensure_array_like, e as escape_html, a3 as derived, a7 as store_get, a8 as unsubscribe_stores, a9 as stringify, aa as head } from "../../chunks/renderer.js";
import { w as writable } from "../../chunks/index.js";
const selectedPathway = writable(null);
const modalCourse = writable(null);
function Sidebar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { pathways = [] } = $$props;
    let mobileOpen = false;
    let current = derived(() => store_get($$store_subs ??= {}, "$selectedPathway", selectedPathway));
    $$renderer2.push(`<button class="sidebar-toggle svelte-129hoe0"${attr("aria-label", "Open pathway menu")}${attr("aria-expanded", mobileOpen)}><span${attr_class("toggle-bar svelte-129hoe0", void 0, { "open": mobileOpen })}></span> <span${attr_class("toggle-bar svelte-129hoe0", void 0, { "open": mobileOpen })}></span> <span${attr_class("toggle-bar svelte-129hoe0", void 0, { "open": mobileOpen })}></span></button> <aside${attr_class("sidebar svelte-129hoe0", void 0, { "mobile-open": mobileOpen })} role="navigation" aria-label="Pathway selection"><div class="sidebar-header svelte-129hoe0"><h2 class="svelte-129hoe0">Digital Futures</h2></div> <div class="pathway-cards svelte-129hoe0" role="listbox" aria-label="Available pathways"><!--[-->`);
    const each_array = ensure_array_like(pathways);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let pw = each_array[$$index];
      $$renderer2.push(`<div${attr_class("pathway-card svelte-129hoe0", void 0, { "active": current() === pw.id })} role="option" tabindex="0"${attr("aria-selected", current() === pw.id)}><h3 class="svelte-129hoe0">${escape_html(pw.title)}</h3> <p class="svelte-129hoe0">${escape_html(pw.description)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="sidebar-footer svelte-129hoe0"><p class="elective-note svelte-129hoe0">Note: Elective courses are not guaranteed to be offered in any given semester</p></div></aside>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function CourseItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { course, required = false } = $$props;
    let credits = derived(() => course.credits ?? 3);
    let sizeClass = derived(() => credits() <= 1.5 ? "half" : "full");
    $$renderer2.push(`<div${attr_class(`course-item ${stringify(sizeClass())}`, "svelte-1135egu", { "required": required })} role="button" tabindex="0"${attr("aria-label", `${stringify(course.code)}: ${stringify(course.name)}${stringify(required ? " (required)" : "")}`)}><span class="course-code svelte-1135egu">${escape_html(course.code)}</span> <span class="course-name svelte-1135egu">${escape_html(course.name)}</span> `);
    if (credits() !== 3) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="course-credits svelte-1135egu">${escape_html(credits())} cr</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function CourseCell($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { courses = [], requiredCourses = [], courseType = "" } = $$props;
    $$renderer2.push(`<div class="course-cell svelte-1t5m5sv"${attr("data-course-type", courseType)}>`);
    if (courses.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<!--[-->`);
      const each_array = ensure_array_like(courses);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let course = each_array[$$index];
        CourseItem($$renderer2, { course, required: requiredCourses.includes(course.code) });
      }
      $$renderer2.push(`<!--]-->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function CourseGrid($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data = null } = $$props;
    const courseTypeLabels = [
      { key: "core_courses", label: "Core" },
      {
        key: "program_specific_electives",
        label: "Program Electives"
      },
      { key: "open_electives", label: "Open Electives" },
      { key: "breadth_electives", label: "Breadth Electives" }
    ];
    let years = derived(() => data ? Object.keys(data.years).sort((a, b) => Number(a) - Number(b)) : []);
    let requiredCourses = derived(() => data?.required_courses ?? []);
    if (data) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid-wrapper svelte-1jpn8pr"><div class="grid-header svelte-1jpn8pr"><div class="header-spacer svelte-1jpn8pr"></div> <div class="header-spacer svelte-1jpn8pr"></div> <!--[-->`);
      const each_array = ensure_array_like(courseTypeLabels);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let ct = each_array[$$index];
        $$renderer2.push(`<div class="column-header svelte-1jpn8pr">${escape_html(ct.label)}</div>`);
      }
      $$renderer2.push(`<!--]--></div> <!--[-->`);
      const each_array_1 = ensure_array_like(years());
      for (let $$index_3 = 0, $$length = each_array_1.length; $$index_3 < $$length; $$index_3++) {
        let yearNum = each_array_1[$$index_3];
        const yearData = data.years[yearNum];
        $$renderer2.push(`<div class="year-group svelte-1jpn8pr"${attr("data-year", yearNum)}><div class="semester-row svelte-1jpn8pr"><div class="year-label year-fall-label svelte-1jpn8pr"${attr("data-year", yearNum)}>Year ${escape_html(yearNum)}</div> <div class="semester-label svelte-1jpn8pr">Fall</div> <!--[-->`);
        const each_array_2 = ensure_array_like(courseTypeLabels);
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let ct = each_array_2[$$index_1];
          CourseCell($$renderer2, {
            courses: yearData.fall?.[ct.key] ?? [],
            requiredCourses: requiredCourses(),
            courseType: ct.label
          });
        }
        $$renderer2.push(`<!--]--></div> <div class="semester-row svelte-1jpn8pr"><div class="year-label year-winter-label svelte-1jpn8pr"></div> <div class="semester-label svelte-1jpn8pr">Winter</div> <!--[-->`);
        const each_array_3 = ensure_array_like(courseTypeLabels);
        for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
          let ct = each_array_3[$$index_2];
          CourseCell($$renderer2, {
            courses: yearData.winter?.[ct.key] ?? [],
            requiredCourses: requiredCourses(),
            courseType: ct.label
          });
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="empty-state svelte-1jpn8pr"><p>Select a pathway to view the course plan.</p></div>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function CourseModal($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let course = derived(() => store_get($$store_subs ??= {}, "$modalCourse", modalCourse));
    if (course()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="modal-backdrop svelte-1ssjrka"><div class="modal-content svelte-1ssjrka" role="dialog" aria-modal="true"${attr("aria-label", `${stringify(course().code)}: ${stringify(course().name)}`)} tabindex="-1"><button class="modal-close svelte-1ssjrka" aria-label="Close dialog">×</button> <div class="modal-header svelte-1ssjrka"><span class="modal-code svelte-1ssjrka">${escape_html(course().code)}</span> <h2 class="modal-title svelte-1ssjrka">${escape_html(course().name)}</h2></div> <div class="modal-body svelte-1ssjrka">`);
      if (course().credits) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="modal-field svelte-1ssjrka"><span class="field-label svelte-1ssjrka">Credits</span> <span class="field-value svelte-1ssjrka">${escape_html(course().credits)}</span></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (course().description) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="modal-field svelte-1ssjrka"><span class="field-label svelte-1ssjrka">Description</span> <p class="field-value svelte-1ssjrka">${escape_html(course().description)}</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (course().prerequisites) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="modal-field svelte-1ssjrka"><span class="field-label svelte-1ssjrka">Prerequisites</span> <p class="field-value svelte-1ssjrka">${escape_html(course().prerequisites)}</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (course().notes) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="modal-field svelte-1ssjrka"><span class="field-label svelte-1ssjrka">Notes</span> <p class="field-value svelte-1ssjrka">${escape_html(course().notes)}</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let { data } = $$props;
    let current = derived(() => store_get($$store_subs ??= {}, "$selectedPathway", selectedPathway));
    let currentData = derived(() => current() ? data.pathwayData[current()] ?? null : null);
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>${escape_html(currentData() ? `${currentData().name} — ` : "")}Digital Futures Pathways</title>`);
      });
      $$renderer3.push(`<meta name="description" content="Explore undergraduate pathway plans for the Digital Futures program at OCAD University."/>`);
    });
    $$renderer2.push(`<div class="app-layout svelte-1uha8ag">`);
    Sidebar($$renderer2, { pathways: data.pathways });
    $$renderer2.push(`<!----> <main class="main-content svelte-1uha8ag">`);
    if (currentData()) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<header class="content-header svelte-1uha8ag"><h1 class="svelte-1uha8ag">${escape_html(currentData().name)}</h1></header>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    CourseGrid($$renderer2, { data: currentData() });
    $$renderer2.push(`<!----></main></div> `);
    CourseModal($$renderer2);
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
