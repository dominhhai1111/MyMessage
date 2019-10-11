import Constants from 'expo-constants';
import React from 'react';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export default class Status extends React.Component {
    state = {
        info: 'none',
    };

    async componentWillMount() {
        this.subsciption = NetInfo.addEventListener( state => {
            this.handleChange(state.type);
        });

        this.setNetInfo();

        // setTimeout(() => this.handleChange('none'), 3000); 
    }

    componentDidMount() {
        this.subsciption();
    }

    setNetInfo = async () => {
        NetInfo.fetch().then(state => {
            this.handleChange(state.type);
        });
    }

    handleChange = (info) => {
        this.setState({ info });
    };

    render() {
        const { info } = this.state;

        const isConnected = info !== 'none';
        const backgroundColor = isConnected ? 'white' : 'red';

        const statusBar = (
            <StatusBar
                backgroundColor={backgroundColor}
                barStyle={isConnected ? 'dark-content' : 'light-content'}
                animated={false}
            />
        );

        const messageContainer = (
            <View style={styles.messageContainer} pointerEvents={'none'}>
                {statusBar}
                {!isConnected && (
                    <View style={styles.bubble}>
                        <Text style={styles.text}>No network connection</Text>
                    </View>
                )}
            </View>
        );

        if (Platform.OS === 'ios') {
            return <View style={[styles.status, { backgroundColor }]}>{messageContainer}</View>
        }

        return messageContainer;
    }
}

const statusHeight = (
    Platform.OS === 'ios' ? Constants.statusBarHeight : 0
);

const styles = StyleSheet.create({
    status: {
        zIndex: 1,
        height: statusHeight,
    },

    messageContainer: {
        zIndex: 1,
        position: 'absolute',
        top: statusHeight + 40,
        right: 0,
        left: 0,
        height: 80,
        alignItems: 'center',
    },

    bubble: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: 'red',
    },

    text: {
        color: 'white',
    }
});