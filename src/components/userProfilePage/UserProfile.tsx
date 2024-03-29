import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { isMobile } from "react-device-detect";

import { ReduxCombinedState } from "redux/reducers";
import actions from 'redux/actions/requestFailed';
import brickActions from "redux/actions/brickActions";
import userActions from "redux/actions/user";
import authActions from "redux/actions/auth";
import RolesBox from './RolesBox';
import "./UserProfile.scss";

import { getGeneralSubject } from 'components/services/subject';
import { UpdateUserStatus, UserProfileField, UserRoleItem } from './model';
import { getUserById, createUser, updateUser, saveProfileImageName } from 'services/axios/user';
import { isValid, getUserProfile } from './service';
import { User, UserType, UserProfile, UserPreferenceType, SubscriptionState } from "model/user";
import { Subject } from "model/brick";
import { checkAdmin, formatTwoLastDigits } from "components/services/brickService";
import { getSubjects } from "services/axios/subject";

import SubjectAutocomplete from "./components/SubjectAutoCompete";
import SubjectDialog from "./components/SubjectDialog";
import SaveProfileButton from "./components/SaveProfileButton";
import ProfileSavedDialog from "./components/ProfileSavedDialog";
import ProfileImage from "./components/ProfileImage";
import PageHeadWithMenu, { PageEnum } from "components/baseComponents/pageHeader/PageHeadWithMenu";
import ValidationFailedDialog from "components/baseComponents/dialogs/ValidationFailedDialog";
import SpriteIcon from "components/baseComponents/SpriteIcon";
import ProfileInput from "./components/ProfileInput";
import ProfileIntroJs from "./components/ProfileIntroJs";
import PasswordChangedDialog from "components/baseComponents/dialogs/PasswordChangedDialog";
import ProfilePhonePreview from "./components/ProfilePhonePreview";
import { getExistingUserState, getNewUserState } from "./stateService";
import { isPhone } from "services/phone";
import { maximizeZendeskButton, minimizeZendeskButton } from "services/zendesk";
import SaveIntroJs from "./components/SaveIntroJs";
import ProfileTab from "./ProfileTab";
import map from "components/map";
import { cancelSubscription, getCardDetails } from "services/axios/stripe";
import RealLibraryConnect from "./RealLibraryCoonect";
import ReactiveUserCredits from "./ReactiveUserCredits";
import { GetOrigin, UnsetOrigin } from "localStorage/origin";
import UserCredits from "./UserCredits";
import EmailDisplay from "./components/EmailDisplay";
import EmailConfirmDialog from "./components/EmailConfirmDialog";
import CancelSubscriptionDialog from "components/baseComponents/dialogs/CancelSubscriptionDialog";


const MobileTheme = React.lazy(() => import("./themes/UserMobileTheme"));
const TabletTheme = React.lazy(() => import("./themes/UserTabletTheme"));

interface UserProfileProps {
  user: User;
  location: any;
  history: any;
  match: any;
  forgetBrick(): void;
  redirectedToProfile(): void;
  getUser(): Promise<void>;
  requestFailed(e: string): void;
}

interface UserProfileState {
  noSubjectDialogOpen: boolean;
  savedDialogOpen: boolean;
  emailInvalidOpen: boolean;
  passwordChangedDialog: boolean;

  cancelSubscriptionDialog: boolean;

  previewAnimationFinished: boolean;

  last4?: string | null; // credit card last 4 digits
  nextPaymentDate?: number | null; // dateTime() number
  subscriptionExpired: boolean;

  userBrills?: number;
  userCredits?: number;

  library: any;
  isFromInstitution: boolean | undefined;

  user: UserProfile;
  subjects: Subject[];
  isNewUser: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  roles: UserRoleItem[];
  validationRequired: boolean;
  emailInvalid: boolean;
  editPassword: boolean;
  saveDisabled: boolean;
  minimizeTimeout?: number | NodeJS.Timeout;
  introJsSuspended?: boolean;

  isProfile: boolean;

  subscriptionState?: number;

  isLoaded: boolean;

  emailConfirmDialog: boolean;
  emailConfirmed: boolean;

  originLibrary: boolean;
  stepsEnabled: boolean;
}

class UserProfilePage extends Component<UserProfileProps, UserProfileState> {
  constructor(props: UserProfileProps) {
    super(props);
    this.props.redirectedToProfile();
    const { userId } = props.match.params;
    const isAdmin = checkAdmin(props.user.roles);

    // check if admin wanna create new user
    if (userId === "new") {
      if (isAdmin) {
        this.state = getNewUserState(isAdmin);
      } else {
        props.history.push("/home");
      }
    } else {
      const { user } = props;

      let tempState: UserProfileState = getExistingUserState(user);

      // If userId in the url
      if (userId) {

        this.state = tempState;
        getUserById(userId).then(user => {
          if (user) {
            this.setState({
              user: getUserProfile(user),
              library: user.library,
              isFromInstitution: user.isFromInstitution,
              userBrills: user.brills,
              subscriptionState: user.subscriptionState,
              userCredits: user.freeAttemptsLeft
            });
          } else {
            this.props.requestFailed("Can`t get user profile");
          }
        });
      } else {
        // Assume it is the current users profile instead
        tempState.user = getUserProfile(user);
        tempState.userCredits = tempState.user.freeAttemptsLeft;
        this.state = tempState;
      }
      if (GetOrigin() === 'library') {
        this.state = { ...this.state, originLibrary: true, isProfile: false };
        // IntroJS errors if you start a new intro too quickly after a previous one. Delay enabling the steps a little bit to prevent this.
        this.props.history.push(this.props.history.location.pathname);
        UnsetOrigin();
        setTimeout(() => {
          this.setState({ stepsEnabled: true });
        }, 1000);
      }
    }

    getSubjects().then(subjects => {
      if (subjects) {
        let user = this.state.user;
        const general = getGeneralSubject(subjects);
        if (general) {
          if (user.subjects.length === 0) {
            user.subjects = [general];
          }
        }
        this.setState({ subjects, user });
      } else {
        this.props.requestFailed("Can`t get subjects");
      }
    });
  }

  async componentDidMount() {
    minimizeZendeskButton();
    const minimizeTimeout = setTimeout(() => {
      minimizeZendeskButton();
    }, 1400);
    let nextPaymentDate: number | null = null;
    let last4: string | null = null;
    const cardDetails = await getCardDetails();
    let subscriptionExpired = false;
    if (cardDetails) {
      last4 = cardDetails.last4;
      nextPaymentDate = cardDetails.nextPaymentDate;
      if (this.state.subscriptionState === SubscriptionState.Cancelled && nextPaymentDate === 1673082515000) {
        subscriptionExpired = true;
      }
    }
    this.setState({ minimizeTimeout, nextPaymentDate, last4, subscriptionExpired });
  }

  componentWillUnmount() {
    if (this.state.minimizeTimeout) {
      clearTimeout(this.state.minimizeTimeout);
    }
    maximizeZendeskButton();
  }

  async cancelSubscription() {
    const res = await cancelSubscription(this.state.user.id);
    if (res === true) {
      this.setState({cancelSubscriptionDialog: false});
      this.props.getUser();
    }
  }

  saveStudentProfile(user: UserProfile) {
    const userToSave = {} as any;
    this.prepareUserToSave(userToSave, user);
    userToSave.roles = user.roles;

    if (!user.subjects || user.subjects.length === 0) {
      this.setState({ noSubjectDialogOpen: true });
      return;
    }
    this.save(userToSave);
  }

  prepareUserToSave(userToSave: any, user: UserProfile) {
    userToSave.firstName = user.firstName;
    userToSave.lastName = user.lastName;
    userToSave.email = user.email;
    userToSave.bio = user.bio;

    if (user.password) {
      userToSave.password = user.password;
    }
    if (user.id !== -1) {
      userToSave.id = user.id;
    }
    if (user.subjects) {
      userToSave.subjects = user.subjects.map((s) => s.id);
    }
    if (user.profileImage) {
      userToSave.profileImage = user.profileImage;
    }
  }

  saveUserProfile() {
    const { user } = this.state;

    this.suspendIntroJs();

    if (this.state.isStudent) {
      this.saveStudentProfile(user);
      return;
    }
    const userToSave = { roles: user.roles } as any;
    this.prepareUserToSave(userToSave, user);

    if (!user.subjects || user.subjects.length === 0) {
      this.setState({ noSubjectDialogOpen: true });
      return;
    }
    this.save(userToSave);
  }

  async save(userToSave: any) {
    const valid = isValid(userToSave);
    if (!valid) {
      this.setState({ validationRequired: true });
      return;
    }
    if (this.state.emailInvalid) {
      this.setState({ emailInvalidOpen: true });
      return;
    }

    if (this.state.isNewUser) {
      const status = await createUser(userToSave);
      if (status === UpdateUserStatus.Success) {
        this.setState({ savedDialogOpen: true });
        this.props.getUser();
      } else if (status === UpdateUserStatus.InvalidEmail) {
        this.setState({ emailInvalidOpen: true });
      } else {
        this.props.requestFailed("Can`t save user profile");
      }
    } else {
      const saved = await updateUser(userToSave);
      if (saved) {
        this.setState({ savedDialogOpen: true });
        this.props.getUser();
      } else {
        this.props.requestFailed("Can`t save user profile");
      }
    }
  }

  onInvalidEmailClose() {
    this.setState({ emailInvalidOpen: false });
  }

  onSubjectDialogClose() {
    this.setState({ noSubjectDialogOpen: false });
    this.resumeIntroJs();
  }

  onProfileSavedDialogClose() {
    this.setState({ savedDialogOpen: false });
    this.resumeIntroJs();
  }

  onFieldChanged(e: React.ChangeEvent<HTMLInputElement>, name: UserProfileField) {
    const { user } = this.state;
    user[name] = e.target.value;
    this.setState({ user, saveDisabled: false });
  }

  onEmailChanged(e: React.ChangeEvent<HTMLInputElement>) {
    const { user } = this.state;
    const { value } = e.target;
    user.email = value;
    let emailInvalid = false;
    if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
      emailInvalid = true;
    }
    this.setState({ user, emailInvalid, saveDisabled: false });
  }

  async reloadLibrary() {
    await this.props.getUser();
  }

  onProfileImageChanged(name: string, imagePublic: boolean) {
    const { user } = this.state;
    user.profileImage = name;
    user.profileImagePublic = imagePublic;

    saveProfileImageName(user.id, name, imagePublic).then((res: boolean) => {
      if (res) {
        // upload success
      } else {
        // saving image name failed
      }
    });

    this.setState({ user });
  }

  toggleRole(roleId: number, disabled: boolean) {
    if (disabled) {
      return;
    }
    let index = this.state.user.roles.indexOf(roleId);
    if (index !== -1) {
      // publisher can`t remove his publisher role
      if (roleId === UserType.Publisher) {
        const foundUpperRole = this.props.user.roles.find(r => r.roleId === UserType.Admin);
        if (!foundUpperRole) {
          return;
        }
      }
      this.state.user.roles.splice(index, 1);
    } else {
      this.state.user.roles.push(roleId);
    }
    this.setState({ ...this.state, saveDisabled: false });
  }

  onSubjectChange(newValue: any[]) {
    const { user } = this.state;
    user.subjects = newValue;
    this.setState({ user, saveDisabled: false });
  }

  async changePassword() {
    this.setState({ editPassword: false });
  }

  suspendIntroJs() {
    if (!this.state.introJsSuspended) {
      this.setState({ introJsSuspended: true });
    }
  }

  resumeIntroJs() {
    if (this.state.introJsSuspended) {
      this.setState({ introJsSuspended: false });
    }
  }

  renderSubjects(user: UserProfile) {
    if (user.id === -1 || this.state.subjects.length === 0) {
      return;
    }
    return (
      <SubjectAutocomplete
        selected={user.subjects}
        subjects={this.state.subjects}
        suspendIntroJs={this.suspendIntroJs.bind(this)}
        resumeIntroJs={this.resumeIntroJs.bind(this)}
        onSubjectChange={(subjects) => this.onSubjectChange(subjects)}
      />
    );
  }

  previewAnimationFinished() {
    this.setState({ previewAnimationFinished: true })
  }

  renderProfileBlock(user: UserProfile) {
    let isStudent = user.userPreference?.preferenceId === UserPreferenceType.Student;

    return (
      <div className="profile-block">
        <div className="absolute-top-container flex-center">
          <div className="brills-number">
            {this.state.userBrills}
          </div>
          <div className="brill-coin-img">
            <img alt="brill" className="brills-icon" src="/images/Brill.svg" />
            <SpriteIcon name="logo" />
          </div>
          {(this.state.isFromInstitution || this.state.library) ? <div /> : <UserCredits className="credit-coins-sm" credits={this.state.userCredits} />}
          <div className="absolute-library-link flex-center" onClick={() => this.props.history.push(map.MyLibrary + '/' + this.state.user.id)}>
            <SpriteIcon name="bar-chart-2" />
            <div className="css-custom-tooltip">View library</div>
          </div>
          <div className="save-button-container">
            <SaveProfileButton
              user={user}
              disabled={this.state.saveDisabled}
              onClick={() => this.saveUserProfile()}
            />
          </div>
        </div>
        <div className="profile-fields">
          <ProfileImage
            user={user}
            subscriptionState={this.state.subscriptionState}
            currentUser={this.props.user}
            setImage={this.onProfileImageChanged.bind(this)}
            deleteImage={() => this.onProfileImageChanged('', false)}
            suspendIntroJs={this.suspendIntroJs.bind(this)}
            resumeIntroJs={this.resumeIntroJs.bind(this)}
          />
          <div className="profile-inputs-container">
            <div className="input-group">
              <ProfileInput
                value={user.firstName} validationRequired={this.state.validationRequired}
                className="first-name" placeholder="Name" disabled={this.state.isFromInstitution}
                onChange={e => this.onFieldChanged(e, UserProfileField.FirstName)}
              />
              <ProfileInput
                value={user.lastName} validationRequired={this.state.validationRequired}
                className="last-name" placeholder="Surname" disabled={this.state.isFromInstitution}
                onChange={e => this.onFieldChanged(e, UserProfileField.LastName)}
              />
            </div>
            {(this.props.user.library && this.state.emailConfirmed === false) ? <EmailDisplay value={user.email} onClick={() => {
              this.setState({ emailConfirmDialog: true });
            }} /> :
              <ProfileInput
                value={user.email} validationRequired={this.state.validationRequired}
                className="" placeholder="Email" type="email" disabled={this.state.isFromInstitution}
                onChange={e => this.onEmailChanged(e)}
              />}
            <div className="password-container">
              <ProfileInput
                value={user.password} validationRequired={this.state.validationRequired}
                className="" placeholder="●●●●●●●●●●●" type="password" shouldBeFilled={false}
                onChange={e => this.onFieldChanged(e, UserProfileField.Password)}
                disabled={!!this.props.user.library}
              />
            </div>
          </div>
          <div className="profile-roles-container">
            {this.state.user.userPreference &&
              <RolesBox
                roles={this.state.roles}
                user={this.props.user}
                userId={this.state.user.id}
                userRoles={this.state.user.roles}
                isAdmin={this.state.isAdmin}
                userPreference={this.state.user.userPreference?.preferenceId}
                togglePreference={() => this.setState({ saveDisabled: false })}
                toggleRole={this.toggleRole.bind(this)}
              />}
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          {this.renderSubjects(user)}
          <div className="centered">
            <SpriteIcon
              name="arrow-left-2"
              className={`svg red-circle ${this.state.previewAnimationFinished ? '' : 'hidden'}`}
            />
          </div>
        </div>
        {!isStudent &&
          <Grid container direction="row" className="big-input-container bio-container-2">
            <textarea
              className="style2 bio-container"
              value={user.bio}
              onClick={this.suspendIntroJs.bind(this)}
              placeholder="Write a short bio here..."
              onChange={e => {
                this.onFieldChanged(e as any, UserProfileField.Bio)
              }}
              onBlur={this.resumeIntroJs.bind(this)}
            />
          </Grid>}
      </div>
    );
  }

  onIntroExit() {
    this.setState({ stepsEnabled: false });
  }

  onIntroChanged(e: any) {
    if (e >= 2) {
      this.setState({ stepsEnabled: false });
    }
  }

  renderManageAccount() {
    const { subscriptionState } = this.props.user;
    const { subscriptionInterval } = this.props.user;

    const renderNextBillingDate = (nextBillingDate?: number | null) => {
      if (this.state.subscriptionExpired && this.state.subscriptionState === SubscriptionState.Cancelled) {
        return <div className="next-billing-date" />;
      }
      if (this.state.subscriptionState === SubscriptionState.StudentViaBrills) {
        return <div className="next-billing-date" />;
      }

      if (nextBillingDate && subscriptionState && subscriptionState > 1) {
        const date = new Date(nextBillingDate);

        if (subscriptionState === SubscriptionState.Cancelled) {
          return <span className="next-billing-date">Access until: {formatTwoLastDigits(date.getMonth() + 1)}.{formatTwoLastDigits(date.getDate())}.{date.getFullYear()}</span>
        }

        return <span className="next-billing-date">Your next billing date is {formatTwoLastDigits(date.getMonth() + 1)}.{formatTwoLastDigits(date.getDate())}.{date.getFullYear()}</span>
      }
      return <span className="next-billing-date" />;
    }

    const renderCurrentPlan = () => {
      const renderLabel = () => {
        return <span className="bold">Current Plan</span>
      }

      if (subscriptionState === 2) {
        return (
          <div className="current-plan">
            <span>
              {renderLabel()} Learner Subscription <SpriteIcon name="hero-sparkle" />
            </span>
            <div className="price">{subscriptionInterval == 0 ? '£4.99 monthly' : '£49.99 annually'} </div>
          </div>
        );
      } else if (subscriptionState === 3) {
        return (
          <div className="current-plan">
            <span>
              {renderLabel()} Educator Subscription <SpriteIcon name="hero-sparkle" />
            </span>
            <div className="price">{subscriptionInterval == 0 ? '£6.49 monthly' : '£64.99 annually'} </div>
          </div>
        );
      } else if (subscriptionState === SubscriptionState.StudentViaBrills) {
        return (
          <div className="current-plan">
            <span>
              {renderLabel()} Learner Subscription <SpriteIcon name="hero-sparkle" />
            </span>
          </div>
        );
      }

      if (this.props.user.library) {
        return (
          <div className="current-plan">
            <span>
              {renderLabel()} Library User
            </span>
          </div>
        );
      }

      const renderPremiumButton = () => {
        if (this.props.user.isFromInstitution) {
          return <div />;
        }

        return (
          <div className="price btn" onClick={() => this.props.history.push(map.ChoosePlan)}>
            <div>Subscribe <SpriteIcon name="hero-sparkle" /></div>
          </div>
        )
      }

      if (subscriptionState === SubscriptionState.Cancelled) {
        if (this.state.subscriptionExpired) {
          return (
            <div className="current-plan">
              <span>
                {renderLabel()} Subscription Expired
              </span>
              {renderPremiumButton()}
            </div>
          );
        }
        return (
          <div className="current-plan">
            <span>
              {renderLabel()} Subscription Cancelled
            </span>
          </div>
        );
      }
      
      const institutionUser = this.state.user.roles.find(r => r === UserType.InstitutionUser);

      if (institutionUser) {
        if (this.state.user.userPreference?.preferenceId === UserPreferenceType.Teacher) {
          return (
            <div className="current-plan">
              <span>
                {renderLabel()} Institution Teacher
              </span>
              {renderPremiumButton()}
            </div>
          );
        } else {
          return (
            <div className="current-plan">
              <span>
                {renderLabel()} Institution Student
              </span>
              {renderPremiumButton()}
            </div>
          );
        }
      }

      return (
        <div className="current-plan">
          <span>
            {renderLabel()} Free Trial
          </span>
          {renderPremiumButton()}
        </div>
      );
    }

    const renderCredits = () => {
      if (this.state.userBrills || this.state.userBrills === 0) {
        return (
          <div className="credits-container">
            <div className="first-row flex-center">
              <div className="brills-container flex-center">
                <div className="brill-coin-img">
                  <img alt="brill" className="brills-icon" src="/images/Brill.svg" />
                  <SpriteIcon name="logo" />
                </div>
                <div className="bold">
                  {this.state.userBrills} Brills
                </div>
              </div>
              {(this.state.isFromInstitution || this.state.library) ? <div /> :
                <div className="credits-part flex-center">
                  <div className="user-credits">
                    <SpriteIcon name="circle-lines" />
                    <div className="flex-center bold">{this.props.match.params.userId ? this.state.userCredits : <ReactiveUserCredits />}</div>
                  </div>
                  <div className="bold label">
                    Credits
                  </div>
                </div>}
            </div>
          </div>
        );
      }
      return '';
    }

    const renderLeaveContainer = () => {
      if (this.props.user.subscriptionState && this.props.user.subscriptionState >= 2 && this.state.subscriptionState !== SubscriptionState.Cancelled) {
        return (
          <div className="leave-container">
            <div className="label">Thinking of leaving us?</div>
            <a className="btn first-btn" href="mailto: support@scholar6.org">
              <SpriteIcon name="email" /> Tell us what would make you stay
            </a>
            <div className="btn" onClick={() => this.setState({cancelSubscriptionDialog: true})}>
              Cancel Subscription
            </div>
          </div>
        )
      }
      return '';
    }

    const renderPaymentMethod = () => {
      if (this.state.last4) {
        return (
          <div className="card-details">
            Credit Card <span className="bigger-circles">•••• •••• ••••</span> <span className="light">[{this.state.last4}]</span>
            <div className="flex-center btn">
              <SpriteIcon name="edit-outline" />
              Change payment method
            </div>
          </div>
        );
      }
      return '';
    }

    const renderLibrary = () => {
      const {subscriptionState} = this.props.user;
      if (subscriptionState && (subscriptionState === 2 || subscriptionState === 3 || subscriptionState === SubscriptionState.Cancelled)) {
        return <div />;
      }
      
      if (subscriptionState && subscriptionState === SubscriptionState.StudentViaBrills) {
        return <div />;
      }
      
      if (this.props.user.isFromInstitution) {
        return <div />;
      }
      return <RealLibraryConnect user={this.props.user} reloadLibrary={() => { }} />
    }

    return (
      <div className="profile-block manage-account-block" >
        <div className="current-plan-box flex-center">
          {renderCurrentPlan()}
          {renderNextBillingDate(this.state.nextPaymentDate)}
        </div>
        {renderCredits()}
        {renderPaymentMethod()}
        {renderLeaveContainer()}
        {renderLibrary()}
      </div>
    );
  }

  render() {
    const { user } = this.state;
    const canMove = user.username ? true : false;

    const mockHistory = {
      location: this.props.history.location,
      push() { }
    } as any;

    return (
      <React.Suspense fallback={<></>}>
        <div className="main-listing user-profile-page">
          {isPhone() ? <MobileTheme /> : isMobile && <TabletTheme />}
          <PageHeadWithMenu
            page={PageEnum.Profile}
            user={this.props.user}
            searchHidden={true}
            history={canMove ? this.props.history : mockHistory}
            search={() => { }}
            searching={() => { }}
          />
          <div className="mobile-upper-space" />
          <ProfileTab roles={this.state.roles} userPreference={this.state.user.userPreference} isProfile={this.state.isProfile} onSwitch={() => this.setState({ isProfile: !this.state.isProfile })} />
          <Grid container direction="row" className="user-profile-content">
            {this.state.isProfile ? this.renderProfileBlock(user) : this.renderManageAccount()}
            <ProfilePhonePreview user={user} previewAnimationFinished={this.previewAnimationFinished.bind(this)} />
          </Grid>
          <ValidationFailedDialog
            isOpen={this.state.emailInvalidOpen}
            header={this.state.emailInvalid ? "That email address doesn’t look right" : "Email is already in use"}
            label="Have you spelled it correctly?"
            close={this.onInvalidEmailClose.bind(this)}
          />
          <EmailConfirmDialog
            isOpen={this.state.emailConfirmDialog}
            email={this.state.user.email}
            setEmail={newEmail => {
              const {user} = this.state;
              user.email = newEmail;
              this.setState({ user});
            }}
            close={() => {
              this.setState({ emailConfirmDialog: false });
            }}
          />
          <SubjectDialog
            isOpen={this.state.noSubjectDialogOpen}
            close={this.onSubjectDialogClose.bind(this)}
          />
          <ProfileSavedDialog
            isAdmin={this.state.isAdmin}
            history={this.props.history}
            isOpen={this.state.savedDialogOpen}
            close={this.onProfileSavedDialogClose.bind(this)}
          />
          <PasswordChangedDialog
            isOpen={this.state.passwordChangedDialog}
            close={() => this.setState({ passwordChangedDialog: false })} />
          <ProfileIntroJs user={this.props.user} suspended={this.state.introJsSuspended} history={this.props.history} location={this.props.location} />
          {!this.state.saveDisabled && <SaveIntroJs />}
          <CancelSubscriptionDialog
            isOpen={this.state.cancelSubscriptionDialog}
            history={this.props.history}
            submit={() => this.cancelSubscription()}
            close={() => this.setState({cancelSubscriptionDialog: false})}
          />
        </div>
      </React.Suspense>
    );
  }
}

const mapState = (state: ReduxCombinedState) => ({ user: state.user.user });

const mapDispatch = (dispatch: any) => ({
  forgetBrick: () => dispatch(brickActions.forgetBrick()),
  getUser: () => dispatch(userActions.getUser()),
  redirectedToProfile: () => dispatch(authActions.redirectedToProfile()),
  requestFailed: (e: string) => dispatch(actions.requestFailed(e)),
});

export default connect(mapState, mapDispatch)(UserProfilePage);
