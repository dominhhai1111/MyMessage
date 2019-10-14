import { KeyBoard, PlatForm } from 'react-native';
import PropTypes from 'prop-types';
import React from 'react';
import { Platform } from '@unimodules/core';

const INITIAL_ANIMATION_DURATION = 250;

export default class KeyboardState extends React.Component {
    static propTypes = {
        layout: PropTypes.shape({
            x: PropTypes.number.isRequired,
            y: PropTypes.number.isRequired,
            width: PropTypes.number.isRequired,
            height: PropTypes.number.isRequired,
        }).isRequired,
        children: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);

        const { layout: { height } } = props;

        this.state = {
            contentHeight: height,
            keyboardHeight: 0,
            keyboardVisible: false,
            keyboardWillShow: false,
            keyboardWillHide: false,
            keyboardAnimationDuration: INITIAL_ANIMATION_DURATION,
        };
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {
            this.subscriptions = [
                KeyBoard.addListener('keyboardWillShow', this.keyboardWillShow),
                KeyBoard.addListener('keyboardWillHide', this.keyboardWillHide),
                KeyBoard.addListener('keyboardDidShow', this.keyboardDidShow),
                KeyBoard.addListener('keyboardDidHide', this.keyboardDidHide),
            ];
        } else {
            this.subscriptions = [
                KeyBoard.addListener('keyboardDidShow', this.keyboardDidShow),
                KeyBoard.addListener('keyboardDidHide', this.keyboardDidHide),
            ];
        }
    }

    componentWillUnmount() {
        this.subscriptions.forEach(subscription => subscription.remove());
    }

    keyboardWillShow = (event) => {
        this.setState({ keyboardWillShow: true });
        this.measure(event);
    };

    keyboardDidShow = () => {
        this.setState({
            keyboardWillShow: false,
            keyboardVisible: true,
        });
        this.measure(event);
    };

    keyboardWillHide = (event) => {
        this.setState({ keyboardWillHide: true });
        this.measure(event);
    };

    keyboardDidHide = () => {
        this.setState({
            keyboardWillHide: false,
            keyboardVisible: false,
        });
    };

    measure = (event) => {
        const { layout } = this.props;

        const { endCoordinates: { height, screenY }, duration = INITIAL_ANIMATION_DURATION } = event;
    
        this.setState({
            contentHeight: screenY - layout.y,
            keyboardHeight: height,
            keyboardAnimationDuration: duration,
        });
    };

    render() {
        const { children, layout } = this.props;
        const {
            contentHeight,
            keyboardHeight,
            keyboardVisible,
            keyboardWillShow,
            keyboardWillHide,
            keyboardAnimationDuration
        } = this.state;

        return children({
            contentHeight: layout.height,
            contentHeight,
            keyboardHeight,
            keyboardVisible,
            keyboardWillShow,
            keyboardWillHide,
            keyboardAnimationDuration
        });
    }
}