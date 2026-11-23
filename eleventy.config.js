const readableDate = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function (config) {
  config.addPassthroughCopy({ "src/assets": "assets" });

  config.addCollection("writing", (api) =>
    api
      .getFilteredByGlob("src/writing/*.md")
      .sort((a, b) => b.date - a.date || b.data.order - a.data.order),
  );

  config.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));
  config.addFilter("isoDateTime", (date) => date.toISOString());
  config.addFilter("readableDate", (date) => readableDate.format(date));
  config.addFilter("absoluteUrl", (path, base) => new URL(path, base).href);
  config.addFilter("pad", (number) => String(number).padStart(2, "0"));
  config.addFilter("readingMinutes", (html) => {
    const words = String(html).replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  });

  return {
    templateFormats: ["njk", "md"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
