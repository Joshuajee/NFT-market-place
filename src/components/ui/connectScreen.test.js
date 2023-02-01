import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConnectScreen from './connectScreen';

describe ("Test Connection Screen", () => {

    it("Renders", () => {

        render(<ConnectScreen />);

    })

})
