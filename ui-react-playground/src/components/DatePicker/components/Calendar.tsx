import React, { useState, useEffect } from 'react';

import moment from 'moment';
import { classNames } from '../../utils';

const defaultCalendarHeader = ['一', '二', '三', '四', '五', '六', '日'];
const SHOW_ROW = 6;
const SHOW_COL = 7;
export const DEFAULT_FORMAT = 'YYYY-MM-DD';

export enum DateType {
    prev = 'prev-date',
    cur = 'cur-date',
    next = 'next-date',
}
type DateItem = {
    status: DateType,
    value: Date,
}

export interface IProps {
    rangeDate: Date;
    handleCellClick: (item: DateItem, e: React.MouseEvent) => any;
    curDate: Date;
}

const Calendar: React.FC<IProps> = (props) => {
    const {rangeDate, handleCellClick, curDate} = props;
    const [matrix, setMatrix] = useState(makeDateMatrix(rangeDate));

    useEffect(() => {
        setMatrix(makeDateMatrix(rangeDate));
    }, [rangeDate]);

    return (
        <table className={'calendar-wrapper'}>
            <thead>
                <tr className={classNames('calendar-row')}>
                    {defaultCalendarHeader.map(h => (
                        <th key={h}>
                            <p
                                className={classNames('calendar-head', 'calendar-cell')}>
                                {h}
                            </p>

                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {chunk(matrix).map((tr, i) => (
                    <tr className={classNames('calendar-row')} key={i}>{
                        tr.map((td) => (
                            <td
                                onClick={(e) => {
                                    handleCellClick(td, e);
                                    // [DateType.prev, DateType.next].some(t => t === td.status) && setRangeDate(td.value);
                                    // setCurDate(td.value)
                                }}
                                key={String(td.value)}>
                                <p
                                    className={classNames('calendar-cell', td.status, { today: dateEqual(td.value, new Date), selected: dateEqual(td.value, curDate) })}>
                                    {td.value.getDate()}
                                </p>
                            </td>
                        ))
                    }</tr>)
                )}
            </tbody>
        </table>
    )
}

/**
 * @description 生成日期矩阵
 */
const makeDateMatrix = (currentDate: Date = new Date): DateItem[] => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayInMonth = moment(`${year}-${month + 1}-01`).toDate();
    const lastDayInMonth = moment(firstDayInMonth).add(1, 'months').subtract(1, 'days').toDate();
    let currentDays = lastDayInMonth.getDate();
    let prevLength = !firstDayInMonth.getDay() ? 6 : (firstDayInMonth.getDay() - 1);
    let nextLength = SHOW_ROW * SHOW_COL - prevLength - currentDays;

    const result = [];
    for (let i = 1; i <= prevLength; i++) {
        result.unshift({
            status: DateType.prev,
            value: moment(firstDayInMonth).subtract(i, 'days').toDate()
        })
    }
    for (let i = 0; i < currentDays; i++) {
        result.push({
            status: DateType.cur,
            value: moment(firstDayInMonth).add(i, 'days').toDate(),
        });
    }
    for (let i = 1; i <= nextLength; i++) {
        result.push({
            status: DateType.next,
            value: moment(lastDayInMonth).add(i, 'days').toDate()
        });
    }

    return result;
}

/**
 * @description 数组分块
 */
function chunk<T>(arr: T[], chunkSize = SHOW_COL): T[][] {
    let times = (arr.length / chunkSize) | 1;
    const result = [];
    for (let i = 0; i <= times; i++) {
        result.push(arr.slice(i * chunkSize, (i + 1) * chunkSize));
    }
    return result;
}

function dateEqual(a: Date, b: Date) {
    return moment(a).format(DEFAULT_FORMAT) === moment(b).format(DEFAULT_FORMAT)
}

export default Calendar;