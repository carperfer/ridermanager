import { createAction, props } from "@ngrx/store";

export enum LoadMenuDataActionTypes {
    LoadMenuData = '[MenuData] Load MenuData',
    LoadMenuDataSuccess = '[MenuData] Load MenuData Success',
    LoadMenuDataFailure = '[MenuData] Load MenuData Failure',
}

export const loadMenuData = createAction(
    LoadMenuDataActionTypes.LoadMenuData
);
export const loadMenuDataSuccess = createAction(
    LoadMenuDataActionTypes.LoadMenuDataSuccess,
    props<{ data: any }>()
);
export const loadMenuDataFailure = createAction(
    LoadMenuDataActionTypes.LoadMenuDataFailure,
    props<{ error: any }>()
);