import React from 'react';
import {
    StyleSheet,
    BackHandler,
    LayoutAnimation,
    Platform,
    UIManager,
    View,
} from 'react-native';
import PropTypes from 'prop-types';
import { isIphoneX } from 'react-native-iphone-x-helper';

export const INPUT_METHOD = {
    NONE: 'NONE',
    KEYBOARD: 'KEYBOARD',
    CUSTOM: 'CUSTOM',
};

export class MessagingContainer extends React.Component {
    static propTypes = {
        // From `KeyboardState`
        containerHeight: PropTypes.number.isRequired,
        contentHeight: PropTypes.number.isRequired,
        keyboardHeight: PropTypes.number.isRequired,
        keyboardVisible: PropTypes.bool.isRequired,
        keyboardWillShow: PropTypes.bool.isRequired,
        keyboardWillHide: PropTypes.bool.isRequired,
        keyboardAnimationDuration: PropTypes.bool.isRequired,

        // Managing the IME type
        inputMethod: PropTypes.oneOf(Object.values(INPUT_METHOD)).isRequired,
        onChangeInputMethod: PropTypes.func,

        // Rendering content
        children: PropTypes.node,
        renderInputMethodEditor: PropTypes.func.isRequired,
    };

    static defaultProps = {
        children: null,
        onChangeInputMethod: () => { },
    };

    componentWillReceiveProps(nextProps) {
        const { onChangeInputMethod } = this.props;

        if (!this.componentWillReceiveProps.keyboardVisible && nextProps.keyboardVisible) {
            // Keyboard shown
            onChangeInputMethod(INPUT_METHOD.KEYBOARD);
        } else if (
            // Keyboard hidden
            this.props.keyboardVisible &&
            !nextProps.keyboardVisible &&
            this.props.inputMethod !== INPUT_METHOD.CUSTOM
        ) {
            onChangeInputMethod(INPUT_METHOD.NONE);
        }

        const { keyboardAnimationDuration } = nextProps;

        const animation = LayoutAnimation.create(
            keyboardAnimationDuration,
            Platform.OS === 'android' ? LayoutAnimation.Types.easeInEaseOut : LayoutAnimation.Types.keyboard,
            LayoutAnimation.Properties.opacity,
        );

        LayoutAnimation.configureNext(animation);
    }

    componentDidMount() {
        this.subcription = BackHandler.addEventListener('hardwareBackPress', () => {
            const { onChangeInputMethod, inputMethod } = this.props;

            if (inputMethod === INPUT_METHOD.CUSTOM) {
                onChangeInputMethod(INPUT_METHOD.NONE);
                return true;
            }

            return false;
        });
    }

    componentWillUnmount() {
        this.subcription.remove();
    }

    render() {
        const {
            children,
            renderInputMethodEditor,
            inputMethod,
            containerHeight,
            contentHeight,
            keyboardHeight,
            keyboardWillShow,
            keyboardWillHide,
        } = this.props;

        const useContentHeight = keyboardWillShow ||
            inputMethod === INPUT_METHOD.KEYBOARD;

        const containerStyle = { height: useContentHeight ? contentHeight : containerHeight };

        const showCustomInput = inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;

        // The keyboard is hidden and not transitioning up
        const keyboardIsHidden = inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;

        // The keyboard is visible and transitioning down
        const keyboardIsHiding = inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;

        const inputStyle = {
            height: showCustomInput ? keyboardHeight || 250 : 0,

            // Show extra space id the is an iPhoneX the keyboard is not visible
            marginTop: isIphoneX() && (keyboardIsHidden || keyboardIsHiding) ? 24 : 0,
        };

        return (
            <View style={containerStyle}>
                {children}
                <View style={inputStyle}>{renderInputMethodEditor()}</View>
            </View>
        );
    }
}