import React, {useState, useEffect} from 'react';
import './index.scss';
import moment from 'moment';
import { classNames } from '../utils';

const IconWrapper = (props) => {
    return (
        <>
            {props.left}
            {props.children}
            {props.right}
        </>
    )
};

const defaultCalendarHeader = ['一', '二', '三', '四', '五', '六', '日'];
const SHOW_ROW = 6;
const SHOW_COL = 7;
const DEFAULT_FORMAT = 'YYYY-MM-DD';

const DatePicker: React.FC = () => {
    const [curDate, setCurDate] = useState(new Date);
    const [rangeDate, setRangeDate] = useState(new Date);
    const [matrix, setMatrix] = useState(makeDateMatrix(rangeDate));

    useEffect(() => {
        setMatrix(makeDateMatrix(rangeDate));
    }, [rangeDate]);

    const handleChangeDate = (direction: DateType.prev | DateType.next, type: 'months' | 'years') => () => {
        const next = direction === DateType.prev
            ? moment(rangeDate).subtract(1, type).toDate()
            : moment(rangeDate).add(1, type).toDate();
        setRangeDate(next);
    };

    const handleInputChange = (e) => {
        let v = e.target.value;
        if (v.length !== DEFAULT_FORMAT.length) return;
        if (moment(v).format(DEFAULT_FORMAT) !== v) return;

        v = moment(v);
        setCurDate(v.toDate());
        setRangeDate(v.toDate());
    }


    return (
        <div className={'react-datepicker-wrapper'}>
            <div className="datepicker-edit-input-wrapper">
                <input
                    className={'datepicker-edit-input'}
                    type="text"
                    placeholder={'请选择日期'}
                    onChange={handleInputChange}/>
            </div>
            <hr />
            <header className={'select-header'}>
                <IconWrapper
                    left={<span className={'select-header-icon'} onClick={handleChangeDate(DateType.prev, 'years')}>{"<<"}</span>}
                    right={<span className={'select-header-icon'} onClick={handleChangeDate(DateType.next, 'years')}>{">>"}</span>}
                >
                    <IconWrapper
                        left={<span className={'select-header-icon'} onClick={handleChangeDate(DateType.prev, 'months')}>{"<"}</span>}
                        right={<span className={'select-header-icon'} onClick={handleChangeDate(DateType.next, 'months')}>{">"}</span>}>
                        <div className="select-header-content">{rangeDate.getFullYear()}年 {rangeDate.getMonth() + 1}月</div>
                    </IconWrapper>
                </IconWrapper>
            </header>
            <hr />
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
                                    onClick={() => {
                                        [DateType.prev, DateType.next].some(t => t === td.status) && setRangeDate(td.value);
                                        setCurDate(td.value)
                                    }}
                                    key={String(td.value)}>
                                    <p
                                        className={classNames('calendar-cell', td.status, { today: dateEqual(td.value, new Date), selected: dateEqual(td.value, curDate)})}>
                                        {td.value.getDate()}
                                    </p>
                                </td>
                            ))
                        }</tr>)
                    )}
                </tbody>

            </table>
            <hr />
            <footer className={'action-wrapper'} onClick={() => {setCurDate(new Date);setRangeDate(new Date);}}><span className={'action-wrapper-text'}>今天</span></footer>
        </div>
    );
}

enum DateType {
    prev = 'prev-date',
    cur = 'cur-date',
    next = 'next-date',
}
type DateItem = {
    status: DateType,
    value: Date,
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

export default DatePicker;