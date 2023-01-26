import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dropdown from './dropdown';

describe ("Test Dropdown", () => {

    it("Renders", () => {

        render(<Dropdown> <div></div> </Dropdown>);

    })

})
