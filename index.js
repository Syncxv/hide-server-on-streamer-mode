/** @type {import('../../../fake_node_modules/powercord/entities/').default} */
const { Plugin } = require("powercord/entities");
const {
    FluxDispatcher,
    React,
    getModule,
    getModuleByDisplayName,
    constants,
    i18n: { Messages },
} = require("powercord/webpack");
const { inject, uninject } = require("powercord/injector");

const SiwtchItem = require("./components/SettingsSwitchItem");

class IdkMan extends Plugin {
    constructor(props) {
        super(props);
    }

    startPlugin() {
        FluxDispatcher.subscribe(constants.ActionTypes.STREAMER_MODE_UPDATE, this.handleStreamModeUpdate.bind(this));
        this.patchSwitchItem();
    }

    async patchSwitchItem() {
        const UserSettingsModalStreamerMode = getModuleByDisplayName("FluxContainer(UserSettingsModalStreamerMode)", false);
        inject("STREAMER_FLUXCONTAINER", UserSettingsModalStreamerMode.prototype, "render", (_, res) => {
            inject("ATUAL_STREAMER_TYPE", res.type.prototype, "render", (_, res) => {
                res.props.children.push(React.createElement(SiwtchItem, { get: this.settings.get, set: this.settings.set }));
                return res;
            });
            uninject("STREAMER_FLUXCONTAINER");
            return res;
        });
    }

    handleStreamModeUpdate(e) {
        const serversElemm = document.querySelector(`[aria-label="${Messages.SERVERS}"]`);
        if (e.value) {
            if (!serversElemm) {
                return powercord.api.notices.sendToast("streamer-hide-notif", {
                    type: "failed",
                    header: "Streamer Mode Hide Servers",
                    content: "CANT FIND THE SERVER ELEM :(",
                    buttons: [
                        {
                            text: "Dismiss",
                            color: "green",
                            look: "outlined",
                            onClick: () => powercord.api.notices.closeToast("streamer-hide-notif"),
                        },
                    ],
                    timeout: 1e4,
                });
            }
            serversElemm.style.display = "none";
        } else {
            serversElemm.style.display = "block";
        }
    }
    pluginWillUnload() {
        uninject("STREAMER_FLUXCONTAINER");
        uninject("ATUAL_STREAMER_TYPE");
        FluxDispatcher.unsubscribe(constants.ActionTypes.STREAMER_MODE_UPDATE, this.handleStreamModeUpdate.bind(this));
    }
}

module.exports = IdkMan;
