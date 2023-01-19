import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Driver, DriverSelect } from 'src/app/interfaces/drivers';

export const getDriverState = createFeatureSelector<Driver[]>('drivers');
export const getDropdownDrivers = createSelector(
    getDriverState,
    (drivers: Driver[]): DriverSelect[] => {

        let dropdownDrivers: DriverSelect[] = [];
        drivers.forEach((driver: Driver) => {
            dropdownDrivers.push({
                value: driver.id,
                label: `${driver.first_name} ${driver.last_name}`
            });
        });
        return dropdownDrivers;
    }
);