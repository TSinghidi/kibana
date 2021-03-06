/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import React from 'react';
import { mountWithIntl, shallowWithIntl } from 'test_utils/enzyme_helpers';
import { SpacesManager } from '../../../lib';
import { SpacesNavState } from '../../nav_control';
import { ConfirmDeleteModal } from './confirm_delete_modal';

const buildMockChrome = () => {
  return {
    addBasePath: (path: string) => path,
  };
};

describe('ConfirmDeleteModal', () => {
  it('renders as expected', () => {
    const space = {
      id: 'my-space',
      name: 'My Space',
    };

    const mockHttp = {
      delete: jest.fn(() => Promise.resolve()),
    };
    const mockChrome = buildMockChrome();

    const spacesManager = new SpacesManager(mockHttp, mockChrome, '/');

    const spacesNavState: SpacesNavState = {
      getActiveSpace: () => space,
      refreshSpacesList: jest.fn(),
    };

    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    expect(
      shallowWithIntl(
        <ConfirmDeleteModal.WrappedComponent
          space={space}
          spacesManager={spacesManager}
          spacesNavState={spacesNavState}
          onCancel={onCancel}
          onConfirm={onConfirm}
          intl={null as any}
        />
      )
    ).toMatchSnapshot();
  });

  it(`requires the space name to be typed before confirming`, () => {
    const space = {
      id: 'my-space',
      name: 'My Space',
    };

    const mockHttp = {
      delete: jest.fn(() => Promise.resolve()),
    };
    const mockChrome = buildMockChrome();

    const spacesManager = new SpacesManager(mockHttp, mockChrome, '/');

    const spacesNavState: SpacesNavState = {
      getActiveSpace: () => space,
      refreshSpacesList: jest.fn(),
    };

    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    const wrapper = mountWithIntl(
      <ConfirmDeleteModal.WrappedComponent
        space={space}
        spacesManager={spacesManager}
        spacesNavState={spacesNavState}
        onCancel={onCancel}
        onConfirm={onConfirm}
        intl={null as any}
      />
    );

    const input = wrapper.find('input');
    expect(input).toHaveLength(1);

    input.simulate('change', { target: { value: 'My Invalid Space Name ' } });

    const confirmButton = wrapper.find('button[data-test-subj="confirmModalConfirmButton"]');
    confirmButton.simulate('click');

    expect(onConfirm).not.toHaveBeenCalled();

    input.simulate('change', { target: { value: 'My Space' } });
    confirmButton.simulate('click');

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
