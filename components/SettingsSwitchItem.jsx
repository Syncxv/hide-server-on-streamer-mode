const { React } = require("powercord/webpack");
const { SwitchItem } = require("powercord/components/settings");

module.exports = class FUCKMAN extends React.Component {
    render() {
        const { get, set } = this.props;
        return (
            <SwitchItem
                value={get("enabled", true)}
                onChange={() => {
                    set("enabled", !get("enabled", true));
                    this.forceUpdate();
                }}
                note="Hides the servers when you enable streamer mode"
            >
                Hide Servers
            </SwitchItem>
        );
    }
};
