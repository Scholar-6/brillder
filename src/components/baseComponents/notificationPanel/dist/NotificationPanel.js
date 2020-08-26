"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var react_1 = require("react");
var axios_1 = require("axios");
var react_redux_1 = require("react-redux");
var core_1 = require("@material-ui/core");
var icons_sprite_svg_1 = require("assets/img/icons-sprite.svg");
var notifications_1 = require("model/notifications");
var moment_1 = require("moment");
require("./NotificationPanel.scss");
var map_1 = require("components/map");
var mapState = function (state) { return ({
    notifications: state.notifications.notifications
}); };
var connector = react_redux_1.connect(mapState);
var NotificationPanel = /** @class */ (function (_super) {
    __extends(NotificationPanel, _super);
    function NotificationPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NotificationPanel.prototype.move = function (notification) {
        var history = this.props.history;
        if (history) {
            if (notification.type === notifications_1.NotificationType.BrickPublished) {
                history.push(map_1["default"].ViewAllPage);
            }
            else if (notification.type === notifications_1.NotificationType.AssignedToEdit || notification.type === notifications_1.NotificationType.BrickSubmittedForReview) {
                history.push(map_1["default"].BackToWorkPage);
            }
            else if (notification.type === notifications_1.NotificationType.NewCommentOnBrick) {
                if (notification.brick && notification.brick.id >= 1 && notification.question && notification.question.id >= 1) {
                    history.push(map_1["default"].investigationQuestionSuggestions(notification.brick.id, notification.question.id));
                }
            }
        }
    };
    NotificationPanel.prototype.markAsRead = function (id) {
        axios_1["default"].put(process.env.REACT_APP_BACKEND_HOST + "/notifications/markAsRead/" + id, {}, { withCredentials: true });
    };
    NotificationPanel.prototype.markAllAsRead = function () {
        axios_1["default"].put(process.env.REACT_APP_BACKEND_HOST + "/notifications/unread/markAsRead", {}, { withCredentials: true });
    };
    NotificationPanel.prototype.render = function () {
        var _this = this;
        return (react_1["default"].createElement(core_1.Popover, { open: this.props.shown, onClose: this.props.handleClose, anchorReference: this.props.anchorElement ? "anchorEl" : "none", anchorEl: this.props.anchorElement, className: "notification-box", anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'right'
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'right'
            } },
            react_1["default"].createElement(core_1.Card, { className: "notification-content" },
                react_1["default"].createElement(core_1.CardContent, null,
                    react_1["default"].createElement(core_1.List, { className: "notification-list" }, (this.props.notifications && this.props.notifications.length != 0) ? this.props.notifications.map(function (notification) { return (react_1["default"].createElement(core_1.ListItem, { key: notification.id },
                        react_1["default"].createElement(core_1.ListItemIcon, { className: "left-brick-circle" },
                            react_1["default"].createElement(core_1.SvgIcon, { fontSize: "large" },
                                react_1["default"].createElement("svg", null,
                                    react_1["default"].createElement("circle", { cx: "50%", cy: "50%", r: "50%", fill: notifications_1.notificationTypeColors[notification.type] })))),
                        react_1["default"].createElement("div", { className: "content-box", onClick: function () { return _this.move(notification); } },
                            react_1["default"].createElement(core_1.ListItemText, { className: "notification-detail", primary: notification.title, secondary: notification.text }),
                            react_1["default"].createElement("div", { className: "actions" },
                                react_1["default"].createElement("div", { className: "notification-time" }, moment_1["default"](notification.timestamp).fromNow()),
                                react_1["default"].createElement("button", { "aria-label": "clear", className: "btn btn-transparent delete-notification svgOnHover", onClick: function () { return _this.markAsRead(notification.id); } },
                                    react_1["default"].createElement("svg", { className: "svg w80 h80 active" },
                                        react_1["default"].createElement("use", { href: icons_sprite_svg_1["default"] + "#cancel" }))))))); }) :
                        (react_1["default"].createElement("div", { className: "notification-detail-single" },
                            "You have no new notifications",
                            react_1["default"].createElement("br", null),
                            react_1["default"].createElement("em", null,
                                "\u201CNothing strengthens authority so much as silence\u201D",
                                react_1["default"].createElement("br", null),
                                "- Leonardo da Vinci"),
                            react_1["default"].createElement("em", null,
                                "\u201CWhy then the world's mine oyster...\u201D",
                                react_1["default"].createElement("br", null),
                                "- Shakespeare"))))),
                (this.props.notifications && this.props.notifications.length != 0) &&
                    react_1["default"].createElement(core_1.CardActions, { className: "clear-notification" },
                        react_1["default"].createElement("div", null, "Clear All"),
                        react_1["default"].createElement(core_1.IconButton, { "aria-label": "clear-all", onClick: function () { return _this.markAllAsRead(); } },
                            react_1["default"].createElement(core_1.SvgIcon, null,
                                react_1["default"].createElement("svg", { className: "svg text-white" },
                                    react_1["default"].createElement("use", { href: icons_sprite_svg_1["default"] + "#circle-cancel" }))))))));
    };
    return NotificationPanel;
}(react_1.Component));
exports["default"] = connector(NotificationPanel);
