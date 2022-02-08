import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Dashboard from "./Dashboard";
import { UserProvider } from "../testUtils";


it("matches snapshot", function () {
  const { asFragment } = render(
      <MemoryRouter>
        <UserProvider>
          <Dashboard />
        </UserProvider>
      </MemoryRouter>,
  );
  expect(asFragment()).toMatchSnapshot();
});
