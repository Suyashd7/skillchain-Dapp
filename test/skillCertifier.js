const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillCertifier", function () {
  it("should allow user to add a project", async function () {
    const SkillCertifier = await ethers.getContractFactory("SkillCertifier");
    const skillCertifier = await SkillCertifier.deploy();

    const [owner] = await ethers.getSigners();

    const title = "AI Resume Verifier";
    const description = "A project that verifies resumes using AI";
    const skills = ["AI", "Blockchain", "Solidity"];

    await skillCertifier.addProject(title, description, skills);

    const projects = await skillCertifier.getProjects(owner.address);
    expect(projects.length).to.equal(1);
    expect(projects[0].title).to.equal(title);
    expect(projects[0].description).to.equal(description);
    expect(projects[0].skills).to.deep.equal(skills);
    expect(projects[0].timestamp).to.be.a("bigint"); // Checks timestamp exists
  });
});
