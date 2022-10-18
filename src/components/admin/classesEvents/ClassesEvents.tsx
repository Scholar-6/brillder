import React, { Component } from "react";
import { History } from "history";
import { connect } from "react-redux";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

import './BricksPlayed.scss';
import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import { getAllClassrooms } from 'components/teach/service';

import { User } from "model/user";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import BricksPlayedSidebar, { PDateFilter } from "./BricksPlayedSidebar";
import BricksTab, { BricksActiveTab } from "../bricksPlayed/BricksTab";
import { Subject } from "model/brick";
import { getSubjects } from "services/axios/subject";
import { ClassroomApi } from "components/teach/service";
import SpriteIcon from "components/baseComponents/SpriteIcon";


enum SortBy {
  Name,
  Creator,
  Title,
  Author,
  Played
}

interface TeachProps {
  history: History;
  searchString: string;

  // redux
  user: User;
  requestFailed(e: string): void;
}

interface TeachState {
  sortBy: SortBy;
  downloadClicked: boolean;
  subjects: Subject[];
  selectedSubjects: Subject[];
  classrooms: ClassroomApi[];
  finalClassrooms: ClassroomApi[];
  dateFilter: PDateFilter;
}

class ClassesEvents extends Component<TeachProps, TeachState> {
  constructor(props: TeachProps) {
    super(props);

    this.state = {
      sortBy: SortBy.Name,
      downloadClicked: false,
      dateFilter: PDateFilter.Past24Hours,
      subjects: [],
      selectedSubjects: [],
      classrooms: [],
      finalClassrooms: []
    }
    this.loadInitPlayedData();
  }

  async loadInitPlayedData() {
    const classrooms = await getAllClassrooms();
    if (classrooms) {
      this.setState({ classrooms, finalClassrooms: classrooms });
    }
    const subjects = await getSubjects();
    if (subjects) {
      this.setState({ subjects });
    }
  }

  search() { }
  searching() { }

  sortClassrooms(sortBy: SortBy, classrooms: ClassroomApi[]) {
    if (sortBy === SortBy.Name) {
      return classrooms.sort((a, b) => {
        const aT = a.name.toLocaleLowerCase();
        const bT = b.name.toLocaleLowerCase();
        return aT < bT ? -1 : 1;
      });
    } else if (sortBy === SortBy.Creator) {
      return classrooms.sort((a, b) => {
        const aT = a.teachers[0].firstName.toLocaleLowerCase();
        const bT = b.teachers[0].firstName.toLocaleLowerCase();
        return aT < bT ? -1 : 1;
      });
    } else {
      return classrooms;
    }
  }

  renderBody() {
    const { finalClassrooms } = this.state;
    if (finalClassrooms.length == 0) {
      return <div>No Bricks</div>;
    }

    return <div className="table-body">
      {finalClassrooms.map(c => {
        return (<div className="table-row">
          <div className="name-column">{c.name}</div>
          <div className="creator-column">{c.teachers[0].firstName} {c.teachers[0].lastName}</div>
          <div className="domain-column">domain</div>
          <div className="students-column">{c.students.length}</div>
          <div className="assigned-column">{c.assignmentsCount}</div>
        </div>);
      })}
    </div>
  }

  filterBricksBySubjectsAndSort(classrooms: ClassroomApi[], selectedSubjects: Subject[], sortBy: SortBy) {
    let finalClassrooms: ClassroomApi[] = [];
    if (selectedSubjects.length > 0) {
      for (let brick of finalClassrooms) {
        const found = selectedSubjects.find(s => s.id === brick.subjectId);
        if (found) {
          finalClassrooms.push(brick);
        }
      }
    } else {
      finalClassrooms = [...classrooms];
    }
    finalClassrooms = this.sortClassrooms(sortBy, finalClassrooms);
    return finalClassrooms;
  }

  filterAndSort(bricks: ClassroomApi[], selectedSubjects: Subject[], sortBy: SortBy) {
    return this.filterBricksBySubjectsAndSort(bricks, selectedSubjects, sortBy);
  }

  renderTable() {
    return (
      <div className="table">
        <div className="table-head bold">
          <div className="name-column header">
            <div>Name</div>
            <div>
              <SpriteIcon
                name="sort-arrows"
                onClick={() => {
                  const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Name)
                  this.setState({ sortBy: SortBy.Name, finalClassrooms });
                }}
              />
            </div>
          </div>
          <div className="creator-column header">
            <div>Creator</div>
            <div>
              <SpriteIcon
                name="sort-arrows"
                onClick={() => {
                  const finalClassrooms = this.filterAndSort(this.state.classrooms, this.state.selectedSubjects, SortBy.Creator)
                  this.setState({ sortBy: SortBy.Creator, finalClassrooms });
                }}
              />
            </div>
          </div>
          <div className="domain-column header">
            <div>Domain</div>
          </div>
          <div className="students-column header">
            <div>Students</div>
          </div>
          <div className="assigned-column header">Assigned</div>
        </div>
        {this.renderBody()}
      </div>
    );
  }

  render() {
    return (
      <div className="main-listing user-list-page manage-classrooms-page bricks-played-page">
        <PageHeadWithMenu
          page={PageEnum.ManageClasses}
          placeholder="Brick Title, Student Name, or Subject"
          user={this.props.user}
          history={history}
          search={this.search.bind(this)}
          searching={this.searching.bind(this)}
        />
        <Grid container direction="row" className="sorted-row back-to-work-teach">
          <BricksPlayedSidebar
            isLoaded={true}
            dateFilter={this.state.dateFilter} setDateFilter={dateFilter => {

            }}
            subjects={this.state.subjects}
            selectedSubjects={this.state.selectedSubjects}
            selectSubjects={selectedSubjects => {
              this.setState({ selectedSubjects });
            }}
          />
          <Grid item xs={9} className="brick-row-container">
            <BricksTab activeTab={BricksActiveTab.Classes} history={this.props.history} />
            <div className="tab-content">
              <div className="btn-container">
                <div className="btn btn-green flex-center" onClick={() => this.setState({ downloadClicked: true })}>
                  <div>Export</div>
                  <SpriteIcon name="upload" />
                </div>
              </div>
              {this.state.downloadClicked && <Dialog className="sort-dialog-classes export-dialog-ew35" open={this.state.downloadClicked} onClose={() => this.setState({ downloadClicked: false })}>
                <div className="popup-3rfw bold">
                  <div className="btn-sort" onClick={() => {

                    const exportToCSV = (apiData: any, fileName: string) => {
                      const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                      const fileExtension = ".xlsx";

                      const ws = XLSX.utils.json_to_sheet(apiData);
                      const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
                      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                      const data = new Blob([excelBuffer], { type: fileType });
                      FileSaver.saveAs(data, fileName + fileExtension);
                    }

                    let data: any[] = [];

                    for (const c of this.state.finalClassrooms) {
                      data.push({
                        name: c.name,
                        Creator: c.teachers[0].firstName + ' ' + c.teachers[0].lastName,
                        Domain: 'name',
                        Played: c.assignmentsCount,
                      });
                    }

                    exportToCSV(data, "table");

                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to Excel</div>
                    <SpriteIcon name="excel-icon" />
                  </div>
                  <div className="btn-sort" onClick={() => {
                    const doc = new jsPDF();
                    autoTable(doc, {
                      head: [['Name', 'Creator', 'Domain', 'Creator', 'Students', 'Assignments']],
                      body: this.state.finalClassrooms.map(c => [
                        c.name,
                        c.teachers[0].firstName + ' ' + c.teachers[0].lastName,
                        'domain',
                        c.students.length,
                        c.assignmentsCount ? c.assignmentsCount : ''
                      ]),
                    });
                    doc.save('table.pdf')
                    this.setState({ downloadClicked: false });
                  }}>
                    <div>Export to PDF</div>
                    <img alt="brill" src="/images/PDF_icon.png" />
                  </div>
                </div>
              </Dialog>}
              {this.renderTable()}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(ClassesEvents);
