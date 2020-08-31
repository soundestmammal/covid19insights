import React from 'react';
import { shallow } from 'enzyme';
import Indictators from '../Indicators';

describe('Testing the Indicators Component', () => {
    it('renders the indicators component', () => {
        const wrapper = shallow(<Indictators></Indictators>);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders three question cards', () => {
        const wrapper = shallow(<Indictators></Indictators>);
        expect(wrapper.find('.question-card').length).toEqual(3);
    });
});