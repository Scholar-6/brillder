import { Popover } from '@material-ui/core';
import axios from 'axios';
import SpriteIcon from 'components/baseComponents/SpriteIcon';
import { generateId } from 'components/build/buildQuestions/questionTypes/service/questionBuild';
import BookAnnotation from 'components/postPlay/desktop/BookAnnotation';
import { Annotation, AnnotationLocation } from 'model/attempt';
import { AttemptStats } from 'model/stats';
import { User } from 'model/user';
import React from 'react';
import { connect } from 'react-redux';
import { ReduxCombinedState } from 'redux/reducers';

interface HolisticCommentPanelProps {
    currentUser: User;
    currentAttempt?: AttemptStats;
    setCurrentAttempt(attempt: AttemptStats): void;
    onClose(): void;
    anchorEl?: Element;
}

const HolisticCommentPanel: React.FC<HolisticCommentPanelProps> = props => {
    const createHolisticComment = React.useCallback(() => {
        if(!props.currentAttempt) return;

        const newAttempt = props.currentAttempt;
        const newAnnotation: Annotation = {
            id: generateId(),
            location: AnnotationLocation.Brief,
            priority: 1,
            text: "",
            timestamp: new Date(),
            user: props.currentUser,
            children: [],
        };
        newAttempt.annotations = [...(newAttempt.annotations ?? []), newAnnotation];

        props.setCurrentAttempt(newAttempt);
        saveAttempt(newAttempt);
    /*eslint-disable-next-line*/
    }, [props.currentAttempt]);

    /*eslint-disable-next-line*/
    const annotation = React.useMemo(() => props.currentAttempt?.annotations?.find(a => a.priority === 1), [props.currentAttempt?.annotations]);

    const [currentAnnotation, setCurrentAnnotation] = React.useState<Annotation>();

    const saveAttempt = React.useCallback(async (attempt: AttemptStats) => {
        const newAttempt = Object.assign({}, attempt);

        newAttempt.answers = attempt.answers.map(answer => ({ ...answer, answer: JSON.parse(JSON.parse(answer.answer)) }));
        newAttempt.liveAnswers = attempt.liveAnswers.map(answer => ({ ...answer, answer: JSON.parse(JSON.parse(answer.answer)) }));

        console.log(newAttempt);

        return await axios.put(
            process.env.REACT_APP_BACKEND_HOST + "/play/attempt",
            { id: attempt.id, userId: props.currentUser.id, body: newAttempt },
            { withCredentials: true }
        ).catch(e => {
            if(e.response.status !== 409) {
                throw e;
            }
        });
    /*eslint-disable-next-line*/
    }, []);

    const updateAnnotation = React.useCallback(async () => {
        await (async () => {
            const newAttempt = props.currentAttempt;
            if(!newAttempt || !newAttempt.annotations || !currentAnnotation) return;

            const annotationIndex = newAttempt.annotations.findIndex(a => a.id === currentAnnotation.id);
            if(annotationIndex < 0) return;

            newAttempt.annotations[annotationIndex] = currentAnnotation;
            await saveAttempt(newAttempt);
        })();
        props.onClose();
    /*eslint-disable-next-line*/
    }, [currentAnnotation, props.currentAttempt, saveAttempt]);
    
    React.useEffect(() => {
        if(props.currentAttempt && !annotation) {
            createHolisticComment();
        }
    /*eslint-disable-next-line*/
    }, [props.currentAttempt, annotation])

    if(!annotation) {
        return <></>;
    }

    return (
        <Popover
            open={!!props.anchorEl}
            onClose={props.onClose}
            anchorEl={props.anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
            <div className="holistic-comment-panel">
                <BookAnnotation
                    annotation={annotation}
                    updateAnnotation={(a: Annotation) => setCurrentAnnotation(a)}
                    disableFocus
                />
                <div className="centered" onClick={() => updateAnnotation()}>
                    <div className="save-button b-green">
                        <SpriteIcon name="send" className="active" />
                    </div>
                </div>
            </div>
        </Popover>
    );
};

const mapState = (state: ReduxCombinedState) => ({
    currentUser: state.user.user,
});

export default connect(mapState)(HolisticCommentPanel);