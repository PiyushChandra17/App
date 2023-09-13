import {PanResponder} from 'react-native';

const responder = PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onPanResponderTerminationRequest: () => false,
});

export default responder;
