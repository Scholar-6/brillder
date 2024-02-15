import React, { Component } from "react";

import { stripHtml } from "components/build/questionService/ConvertService";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import { PDateFilter } from "./OverviewSidebar";
import { Dialog } from "@material-ui/core";
import { getOverviewAssignedDetailedData } from "services/axios/brick";

interface AssignedBricksState {
  assignedOpen: boolean;
  assignments: any[];
}

interface AssignedBricksProps {
  isLoading: boolean;
  count: number;
  dateFilter: PDateFilter;
}

class AssignedBricks extends Component<AssignedBricksProps, AssignedBricksState> {
  constructor(props: AssignedBricksProps) {
    super(props);
    this.state = {
      assignedOpen: false,
      assignments: []
    };
  }

  async loadAssignedBricks() {
    // get bricks
    const assignments = await getOverviewAssignedDetailedData(this.props.dateFilter);
    console.log(assignments)
    if (assignments) {
      this.setState({ assignments });
    }
  }

  renderTeachers(a: any) {
    if (a.classroom && a.classroom.teachers && a.classroom.teachers.length > 0) {
      return <td>{a.classroom.teachers.map((t: any) => t.email + ' ')}</td>
    }
    return 'None';
  }

  render() {
    return (
      <div className="">
        <div>
          <div className="bold">
            {this.props.isLoading ? <SpriteIcon name="f-loader" className="spinning" /> : this.props.count}
          </div>
          <div className="second-text-d103 underline" onClick={() => {
            // get bricks
            this.setState({ assignedOpen: true })
            this.loadAssignedBricks();
          }}>Assigned Bricks</div>
        </div>
        {this.state.assignedOpen &&
          <Dialog open={true} onClose={() => { this.setState({ assignedOpen: false }) }}>
            <table className="assignments-list-r-32343" cellSpacing="0" cellPadding="0">
              <thead>
                <tr className="bold">
                  <th>Index</th>
                  <th>Brick title</th>
                  <th>Class name</th>
                  <th>Teacher's email</th>
                  <th>Attempts count</th>
                </tr>
              </thead>
              <tbody>
                {this.state.assignments.map((a, i) => {
                  return <tr>
                    <td>{i+1}</td>
                    <td>{stripHtml(a.brick.title)}</td>
                    <td>{a.classroom.name}</td>
                    {this.renderTeachers(a)}
                    <td>{a.attemptsCount}</td>
                  </tr>
                })}
              </tbody>
            </table>
          </Dialog>
        }
      </div>
    );
  }
}

export default AssignedBricks;
