import pptxgen from "pptxgenjs";
import type { GeneratedVersion, OutputPlan } from "@/lib/ai/schemas";
import { pptTheme } from "@/lib/ppt/theme";

export async function createPresentation(version: GeneratedVersion): Promise<Buffer> {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "MyDesk";
  pptx.subject = version.command;
  pptx.title = version.plan.title;
  pptx.company = "MyDesk";
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos"
  };

  for (const [index, section] of version.plan.sections_or_slides.slice(0, 40).entries()) {
    const slide = pptx.addSlide();
    if (index === 0) {
      addExecutiveSlide(slide, version.plan, section);
    } else if (index % 3 === 1) {
      addThreeColumnSlide(slide, section, index + 1, version.plan.sections_or_slides.length);
    } else {
      addInsightSlide(slide, section, index + 1, version.plan.sections_or_slides.length);
    }
  }

  return (await pptx.write({ outputType: "nodebuffer" })) as Buffer;
}

type SlideSection = OutputPlan["sections_or_slides"][number];

function addExecutiveSlide(slide: pptxgen.Slide, plan: OutputPlan, section: SlideSection) {
  slide.background = { color: pptTheme.colors.navy };
  slide.addText(plan.title, {
    x: 0.7,
    y: 0.65,
    w: 11.8,
    h: 0.85,
    fontFace: "Aptos Display",
    fontSize: 28,
    bold: true,
    color: "FFFFFF",
    fit: "shrink",
    margin: 0
  });
  slide.addText(section.headline, {
    x: 0.75,
    y: 1.85,
    w: 11.6,
    h: 0.75,
    fontSize: 21,
    bold: true,
    color: "FFFFFF",
    fit: "shrink",
    margin: 0
  });
  slide.addShape("rect", { x: 0.75, y: 2.95, w: 11.75, h: 1.0, fill: { color: "FFFFFF", transparency: 8 }, line: { color: "FFFFFF", transparency: 100 } });
  slide.addText(section.key_message, {
    x: 0.75,
    y: 3.08,
    w: 11.7,
    h: 0.72,
    fontSize: 17,
    bold: true,
    color: "FFFFFF",
    fit: "shrink",
    margin: 0
  });
  addExecutiveTakeaways(slide, section.body_points.slice(0, 3));
  addSourceNote(slide, section.source_note, true);
}

function addExecutiveTakeaways(slide: pptxgen.Slide, points: string[]) {
  const labels = ["Executive takeaway", "Strategic implication", "Immediate action"];
  for (const [index, point] of points.entries()) {
    const x = 0.75 + index * 3.95;
    slide.addShape("rect", { x, y: 4.45, w: 3.55, h: 1.45, fill: { color: "FFFFFF", transparency: 0 }, line: { color: "D9E2EA", transparency: 35 } });
    slide.addText(labels[index] || "Decision point", {
      x: x + 0.18,
      y: 4.62,
      w: 3.15,
      h: 0.24,
      fontSize: 8,
      bold: true,
      color: pptTheme.colors.mutedBlue,
      margin: 0
    });
    slide.addText(point, {
      x: x + 0.18,
      y: 4.95,
      w: 3.15,
      h: 0.72,
      fontSize: 12,
      bold: true,
      color: pptTheme.colors.charcoal,
      fit: "shrink",
      margin: 0
    });
  }
}

function addThreeColumnSlide(slide: pptxgen.Slide, section: SlideSection, slideNumber: number, slideCount: number) {
  addSlideFrame(slide, section, slideNumber, slideCount);
  addKeyMessage(slide, section.key_message);

  const labels = chooseColumnLabels(section);
  const points = section.body_points.slice(0, 3);
  for (let index = 0; index < 3; index += 1) {
    const x = 0.72 + index * 4.15;
    slide.addShape("rect", { x, y: 2.25, w: 3.65, h: 2.85, fill: { color: index === 1 ? "EEF3F7" : "FFFFFF" }, line: { color: pptTheme.colors.line } });
    slide.addText(labels[index], {
      x: x + 0.2,
      y: 2.45,
      w: 3.2,
      h: 0.28,
      fontSize: 10,
      bold: true,
      color: pptTheme.colors.mutedBlue,
      margin: 0
    });
    slide.addText(points[index] || "Source needed to complete this view.", {
      x: x + 0.2,
      y: 2.9,
      w: 3.2,
      h: 1.55,
      fontSize: 13,
      bold: index === 2,
      color: pptTheme.colors.charcoal,
      fit: "shrink",
      margin: 0
    });
  }
  addImplicationBand(slide, section);
  addSourceNote(slide, section.source_note);
  addFooter(slide);
}

function addInsightSlide(slide: pptxgen.Slide, section: SlideSection, slideNumber: number, slideCount: number) {
  addSlideFrame(slide, section, slideNumber, slideCount);
  addKeyMessage(slide, section.key_message);

  const points = section.body_points.slice(0, 4);
  slide.addShape("rect", { x: 0.72, y: 2.12, w: 5.65, h: 3.35, fill: { color: "FFFFFF" }, line: { color: pptTheme.colors.line } });
  slide.addText("What matters", {
    x: 0.98,
    y: 2.38,
    w: 5.1,
    h: 0.3,
    fontSize: 10,
    bold: true,
    color: pptTheme.colors.mutedBlue,
    margin: 0
  });
  slide.addText(points.map((point) => ({ text: point, options: { bullet: { indent: 11 }, hanging: 3 } })), {
    x: 1.02,
    y: 2.88,
    w: 4.95,
    h: 1.95,
    fontSize: 12,
    color: pptTheme.colors.charcoal,
    breakLine: false,
    fit: "shrink",
    paraSpaceAfter: 7,
    margin: 0
  });

  slide.addShape("rect", { x: 6.85, y: 2.12, w: 5.7, h: 1.38, fill: { color: pptTheme.colors.lightGrey }, line: { color: pptTheme.colors.line } });
  slide.addText("Strategic consequence", {
    x: 7.12,
    y: 2.35,
    w: 5.1,
    h: 0.25,
    fontSize: 10,
    bold: true,
    color: pptTheme.colors.mutedBlue,
    margin: 0
  });
  slide.addText(section.recommended_visual || "Use a structured chart, matrix, or decision view if source data is available.", {
    x: 7.12,
    y: 2.72,
    w: 5.05,
    h: 0.46,
    fontSize: 12,
    bold: true,
    color: pptTheme.colors.charcoal,
    fit: "shrink",
    margin: 0
  });

  slide.addShape("rect", { x: 6.85, y: 3.78, w: 5.7, h: 1.69, fill: { color: "FFFFFF" }, line: { color: pptTheme.colors.line } });
  slide.addText("Action / owner", {
    x: 7.12,
    y: 4.02,
    w: 5.1,
    h: 0.25,
    fontSize: 10,
    bold: true,
    color: pptTheme.colors.mutedBlue,
    margin: 0
  });
  slide.addText(points[points.length - 1] || section.key_message, {
    x: 7.12,
    y: 4.4,
    w: 5.05,
    h: 0.62,
    fontSize: 13,
    bold: true,
    color: pptTheme.colors.charcoal,
    fit: "shrink",
    margin: 0
  });
  addSourceNote(slide, section.source_note);
  addFooter(slide);
}

function addSlideFrame(slide: pptxgen.Slide, section: SlideSection, slideNumber: number, slideCount: number) {
  slide.background = { color: "FFFFFF" };
  slide.addText(`${slideNumber}/${slideCount}`, {
    x: 0.58,
    y: 0.27,
    w: 0.62,
    h: 0.22,
    fontSize: 8,
    bold: true,
    color: pptTheme.colors.mutedBlue,
    margin: 0
  });
  slide.addText(section.headline, {
    x: 0.58,
    y: 0.55,
    w: 12.15,
    h: 0.62,
    fontFace: "Aptos Display",
    fontSize: 22,
    bold: true,
    color: pptTheme.colors.navy,
    fit: "shrink",
    margin: 0
  });
}

function addKeyMessage(slide: pptxgen.Slide, message: string) {
  slide.addShape("rect", { x: 0.62, y: 1.34, w: 12.05, h: 0.56, fill: { color: "EEF3F7" }, line: { color: "EEF3F7" } });
  slide.addText(message, {
    x: 0.82,
    y: 1.48,
    w: 11.65,
    h: 0.28,
    fontSize: 12,
    bold: true,
    color: pptTheme.colors.charcoal,
    fit: "shrink",
    margin: 0
  });
}

function addImplicationBand(slide: pptxgen.Slide, section: SlideSection) {
  slide.addShape("rect", { x: 0.72, y: 5.42, w: 11.95, h: 0.66, fill: { color: pptTheme.colors.navy }, line: { color: pptTheme.colors.navy } });
  slide.addText(section.recommended_visual || section.key_message, {
    x: 0.98,
    y: 5.58,
    w: 11.35,
    h: 0.26,
    fontSize: 11,
    bold: true,
    color: "FFFFFF",
    fit: "shrink",
    margin: 0
  });
}

function addSourceNote(slide: pptxgen.Slide, sourceNote?: string, dark = false) {
  if (!sourceNote) return;
  slide.addText(sourceNote, {
    x: 0.72,
    y: 6.32,
    w: 11.7,
    h: 0.28,
    fontSize: 8,
    color: dark ? "DCE7F0" : pptTheme.colors.mutedBlue,
    fit: "shrink",
    margin: 0
  });
}

function chooseColumnLabels(section: SlideSection) {
  const text = `${section.type} ${section.headline}`.toLowerCase();
  if (text.includes("barrier") || text.includes("unlock")) return ["Barrier", "Unlock", "Owner / action"];
  if (text.includes("recommend")) return ["Recommendation", "Rationale", "Next step"];
  if (text.includes("market") || text.includes("reality")) return ["Market reality", "Strategic consequence", "Action"];
  return ["Issue", "Implication", "Action"];
}

function addFooter(slide: pptxgen.Slide) {
  slide.addShape("line", { x: 0.55, y: 6.78, w: 12.2, h: 0, line: { color: pptTheme.colors.line, width: 1 } });
  slide.addText(pptTheme.footer, {
    x: 0.6,
    y: 6.88,
    w: 5,
    h: 0.22,
    fontSize: 8,
    color: pptTheme.colors.mutedBlue,
    margin: 0
  });
}
