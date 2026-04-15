const prerender = true;
const PATHWAYS = [
  {
    id: "creative-technologist",
    title: "Creative Technologist",
    description: "Technological generalist focusing on prototypes and emerging tech. Combines technical skills with creative problem-solving across digital domains."
  },
  {
    id: "physical-interface-designer",
    title: "Physical Interface Designer",
    description: "Specializes in digital-physical interfaces and wearables. Bridges the gap between digital experiences and physical interaction design."
  },
  {
    id: "games-playable-media-maker",
    title: "Games & Playable Media Maker",
    description: "Focuses on game design, narratives, and playable media. Creates interactive experiences that engage and entertain through innovative gameplay."
  }
];
async function load({ fetch }) {
  const results = await Promise.allSettled(
    PATHWAYS.map(async (pw) => {
      const res = await fetch(`/data/${pw.id}.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { id: pw.id, data: await res.json() };
    })
  );
  const pathwayData = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      pathwayData[result.value.id] = result.value.data;
    }
  }
  return {
    pathways: PATHWAYS,
    pathwayData
  };
}
export {
  load,
  prerender
};
