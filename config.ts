const config = {
  appName: "Quillminds",
  appDescription:
    "Quillminds is a platform for teachers to create and share lesson plans.",
  domainName:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://quillminds.com",
};

export default config;
