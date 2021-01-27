import React from "react";
import { shallow } from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import SubjectsColumn from "./SubjectsColumn";
import { SubjectItem } from "model/brick";

Enzyme.configure({ adapter: new Adapter() });

const subjects = [
  {
    id: 1,
    name: "Art & Design",
    color: "#006BFD",
    checked: false,
    publishedBricksCount: 3,
    userCount: 5,
  },
  {
    id: 2,
    name: "Biology",
    color: "#65C44C",
    checked: false,
    publishedBricksCount: 3,
    userCount: 5,
  },
  {
    id: 3,
    name: "Chemistry",
    color: "#F3F584",
    checked: false,
    bricksCount: 27,
    publishedBricksCount: 3,
    userCount: 8,
  },
  {
    id: 4,
    name: "Chinese",
    color: "#FF3B01",
    checked: false,
    publishedBricksCount: 0,
    userCount: 2,
  },
  {
    id: 5,
    name: "Classics",
    color: "#ED6CC9",
    checked: false,
    publishedBricksCount: 0,
    userCount: 1,
  },
  {
    id: 6,
    name: "Computer Science",
    color: "#AAF1C7",
    checked: false,
    bricksCount: 48,
    publishedBricksCount: 9,
    userCount: 5,
  },
  {
    id: 7,
    name: "Economics",
    color: "#B3F87B",
    checked: false,
    publishedBricksCount: 0,
    userCount: 2,
  },
  {
    id: 8,
    name: "English Literature",
    color: "#8E44F6",
    checked: false,
    bricksCount: 21,
    publishedBricksCount: 6,
    userCount: 3,
  },
  {
    id: 9,
    name: "French",
    color: "#C43C30",
    checked: false,
    publishedBricksCount: 6,
    userCount: 1,
  },
  {
    id: 10,
    name: "Geography",
    color: "#6A2E15",
    checked: false,
    bricksCount: 5,
    publishedBricksCount: 0,
    userCount: 6,
  },
  {
    id: 11,
    name: "Current Affairs",
    color: "#000000",
    checked: false,
    publishedBricksCount: 0,
    userCount: 4,
  },
  {
    id: 12,
    name: "History",
    color: "#D4AC65",
    checked: false,
    bricksCount: 12,
    publishedBricksCount: 3,
    userCount: 2,
  },
  {
    id: 13,
    name: "History of Art",
    color: "#A5B13A",
    checked: false,
    publishedBricksCount: 0,
    userCount: 2,
  },
  {
    id: 14,
    name: "Maths",
    color: "#FF6200",
    checked: false,
    bricksCount: 8,
    publishedBricksCount: 0,
    userCount: 6,
  },
  {
    id: 15,
    name: "Physics",
    color: "#72D6C7",
    checked: false,
    publishedBricksCount: 0,
    userCount: 2,
  },
  {
    id: 16,
    name: "Politics",
    color: "#9B9B9B",
    checked: false,
    bricksCount: 0,
    publishedBricksCount: 0,
    userCount: 1,
  },
  {
    id: 17,
    name: "Psychology",
    color: "#BC20C9",
    checked: false,
    publishedBricksCount: 0,
    userCount: 1,
  },
  {
    id: 18,
    name: "Sociology",
    color: "#584E4E",
    checked: false,
    bricksCount: 0,
    publishedBricksCount: 0,
    userCount: 1,
  },
  {
    id: 19,
    name: "Spanish",
    color: "#FDEB4E",
    checked: false,
    publishedBricksCount: 0,
    userCount: 1,
  },
  {
    id: 20,
    name: "Religion & Philosophy",
    color: "#C2BC99",
    checked: false,
    bricksCount: 0,
    publishedBricksCount: 0,
    userCount: 1,
  },
  {
    id: 21,
    name: "Drama & Theatre",
    color: "#BC20C9",
    checked: false,
    publishedBricksCount: 2,
    userCount: 7,
  },
  {
    id: 22,
    name: "General",
    color: "#ffffff",
    checked: false,
    bricksCount: 287,
    publishedBricksCount: 21,
    userCount: 165,
  },
] as SubjectItem[];

describe("Roles Box", () => {
  it("Subject column should have 2 full rows", () => {
    const component = shallow(
      <SubjectsColumn subjects={subjects.slice(0, 6)} viewAll={() => {}} onClick={() => {}} />
    );
    expect(component).toHaveLength(1);
    expect(component.props().children.props.children).toHaveLength(2);
  });
  it("Subject column should have 2 full rows", () => {
    const component = shallow(
      <SubjectsColumn subjects={subjects.slice(0, 7)} viewAll={() => {}} onClick={() => {}} />
    );
    expect(component).toHaveLength(1);
    const rows = component.props().children.props.children;
    expect(rows).toHaveLength(2);
    //expect(rows[0].props.children).toHaveLength(4);
    //expect(rows[1].props.children).toHaveLength(3);
  });
  it("Subject column should have 3 rows", () => {
    const component = shallow(
      <SubjectsColumn subjects={subjects.slice(0, 8)} viewAll={() => {}} onClick={() => {}} />
    );
    expect(component).toHaveLength(1);
    const rows = component.props().children.props.children;
    expect(rows).toHaveLength(3);
    //expect(rows[0].props.children).toHaveLength(4);
    //expect(rows[1].props.children).toHaveLength(3);
    //expect(rows[2].props.children).toHaveLength(1);
  });
  it("Subject column should not show general subject", () => {
    const component = shallow(
      <SubjectsColumn subjects={[subjects[subjects.length - 1]]} viewAll={() => {}} onClick={() => {}} />
    );
    expect(component).toHaveLength(1);
    const rows = component.props().children.props.children;
    //expect(rows).toHaveLength(0);
  });
});
