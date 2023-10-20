import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Checkbox } from '@material-ui/core';

import { Brick, Subject } from 'model/brick';
import { assignClasses } from 'services/axios/assignBrick';
import { searchClassroomsByName } from 'services/axios/classroom';

import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { Classroom } from 'model/classroom';

import './AddMultipleToClassDialog.scss';
import { getAllClassrooms } from 'components/teach/service';

interface AssignClassProps {
  brick: Brick;
  subjects: Subject[];

  submit(): void;
  close(): void;
}

const AddMultipleToClassDialog: React.FC<AssignClassProps> = (props) => {
  const [canSubmit, setSubmit] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const [timeoutNumber, setTimeoutNumber] = useState(-1 as number | NodeJS.Timeout);

  const [classrooms, setClassrooms] = useState([] as any[]);
  const [selectedClassrooms, setSelectedClasses] = useState([] as Classroom[]);

  const [topClassrooms, setTopClassrooms] = useState([] as any[]);
  const [searchClassrooms, setSearchClassrooms] = useState([] as any[]);

  const [searchText, setSearchText] = useState('');

  const getClassrooms = async () => {
    const classrooms = await getAllClassrooms();
    if (classrooms) {
      setTopClassrooms(classrooms);
    }
  }

  React.useEffect(() => {
    getClassrooms();
  }, []);

  const addToClasses = async () => {
    if (isSaving) { return; }
    setSaving(true);

    if (selectedClassrooms.length === 0) {
      setSaving(false);
      return;
    }

    const res = await assignClasses(props.brick.id, { classesIds: selectedClassrooms.map(s => s.id) });

    if (res && res.success) {
      props.submit();
    }

    setSaving(false);
  }

  const renderClassrooms = () => {
    if (searchClassrooms && searchClassrooms.length > 0 && searchText.length > 2) {
      let result = [...selectedClassrooms];

      for (let searchClassroom of searchClassrooms) {
        let found = result.find(c => c.id === searchClassroom.id);
        if (!found) {
          result.push(searchClassroom);
        }
      }

      return (
        <div className="classes-container regular">
          {result.map(c => {
            let checked = false;
  
            let found = selectedClassrooms.find(c1 => c1.id === c.id)
            if (found) {
              checked = true;
            }
  
            return <div className="class-container" onClick={() => {
              let index = selectedClassrooms.findIndex(c2 => c2.id === c.id);
              if (index === -1) {
                selectedClassrooms.push(c);
                classrooms.push(c);
                setSelectedClasses([...selectedClassrooms]);
                setClassrooms([...classrooms]);
                setSubmit(true);
              } else {
                selectedClassrooms.splice(index, 1);
                setSelectedClasses([...selectedClassrooms]);
              }
            }}>
              <Checkbox checked={checked} />
              <div dangerouslySetInnerHTML={{__html: c.name}} />
            </div>;
          })}
        </div>
      );
    }
    console.log('top classes')
    return (
      <div className="classes-container regular">
        {topClassrooms.map(c => {
          let checked = false;

          let found = selectedClassrooms.find(c1 => c1.id === c.id)
          if (found) {
            checked = true;
          }

          return <div className="class-container" onClick={() => {
            let index = selectedClassrooms.findIndex(c2 => c2.id === c.id);
            if (index === -1) {
              selectedClassrooms.push(c);
              classrooms.push(c);
              setSelectedClasses([...selectedClassrooms]);
              setClassrooms([...classrooms]);
              setSubmit(true);
            } else {
              selectedClassrooms.splice(index, 1);
              setSelectedClasses([...selectedClassrooms]);
            }
          }}>
            <Checkbox checked={checked} />
            <div>{c.name}</div>
          </div>;
        })}
      </div>
    );
  }

  return (
    <Dialog
      open={true}
      onClose={props.close}
      className="dialog-box light-blue assign-class-dialog create-classroom-dialog new-class-r5 assign-multiple-class"
    >
      <div className="dialog-header">
        <div className="title-box">
          <div className="title font-18">Assigning <span dangerouslySetInnerHTML={{ __html: props.brick.title }} /> to multiple classes</div>
          <SpriteIcon name="cancel-custom" onClick={props.close} />
        </div>
        <div className="r-class-inputs search-class-box">
          <div className="search-container flex-center">
            <SpriteIcon name="search-custom" />
          </div>
          <input
            onChange={async (e) => {
              let value = e.target.value;
              clearTimeout(timeoutNumber)
              let timeoutNew = setTimeout(async () => {
                if (value.length >= 3) {
                  const classes = await searchClassroomsByName(value);
                  if (classes) {
                    setSearchClassrooms(classes);
                  }
                }
              }, 700);
              setTimeoutNumber(timeoutNew);
              setSearchText(e.target.value);
            }}
            placeholder="Search by class name"
          />
        </div>
        {renderClassrooms()}
      </div>
      <div className="dialog-footer">
        <button
          className="btn btn-md font-16 cancel-button"
          onClick={props.close}
        >
          <span className="bold">Cancel</span>
        </button>
        <button
          className={`btn btn-md bg-theme-green font-16 yes-button ${!canSubmit ? 'invalid' : ''}`}
          onClick={addToClasses}
        >
          <span className="bold">Assign</span>
        </button>
      </div>
    </Dialog>
  );
}

export default AddMultipleToClassDialog;
