import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MintModal from './mintModal';

describe ("Test Connection Screen", () => {

    it("Renders", () => {

        render(<MintModal />);

    })

})