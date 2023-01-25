import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
//import ConnectionBtn from './button';

jest.mock('./connectionInfo', () => {
    return () => {
        return "Connection Info"
    }
})

describe ("Connection Button", () => {

    it("Button Exists", () => {

        //render(<ConnectionBtn  />);

    })

})
