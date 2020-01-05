import React, { useState, useEffect } from 'react';
import moment from 'moment';

import './index.scss';
import Calendar, { DEFAULT_FORMAT, DateType, IProps as ICalendar } from './components/Calendar';
import { classNames } from '../utils';

const IconWrapper: React.FC<{left: React.ReactNode; right: React.ReactNode}> = (props) => {
    return (
        <>
            {props.left}
            {props.children}
            {props.right}
        </>
    )
};

interface IPicker {
    inputValue?: string;
    setInputValue: (inputValue: string, valueForMoment: moment.Moment) => void;
    hidePicker: (e) => void;
}

const Picker: React.FC<IPicker> = ({inputValue, setInputValue, hidePicker }) => {
    const [curDate, setCurDate] = useState(inputValue ? new Date(inputValue) : new Date);
    const [rangeDate, setRangeDate] = useState(inputValue ? new Date(inputValue) : new Date);

    const handleChangeDate = (direction: DateType.prev | DateType.next, type: 'months' | 'years') => () => {
        const next = direction === DateType.prev
            ? moment(rangeDate).subtract(1, type).toDate()
            : moment(rangeDate).add(1, type).toDate();
        setRangeDate(next);
    };

    const handleInputChange = (e) => {
        let v = e.target.value.trim();
        const setter = (inputValue: string) => {
            const v = moment(inputValue || new Date);
            setCurDate(v.toDate());
            setRangeDate(v.toDate());
            setInputValue(inputValue, v);
        };

        if (!v) return setter(v);
        if (v.length !== DEFAULT_FORMAT.length) return;
        if (moment(v).format(DEFAULT_FORMAT) !== v) return;

        return setter(v);
    };

    const handleCellClick: ICalendar['handleCellClick'] = (dateItem, e) => {
        setRangeDate(dateItem.value);
        setCurDate(dateItem.value);
        setInputValue(moment(dateItem.value).format(DEFAULT_FORMAT), moment(dateItem.value));
        hidePicker(e);
    };

    const handleFooterClick = handleCellClick.bind(null, {status: DateType.cur, value: new Date});

    const stopEventPropagation = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
    };

    return (
        <div className={classNames('react-datepicker-content')} onClick={stopEventPropagation}>
            <div className='datepicker-edit-input-wrapper'>
                <input
                    defaultValue={inputValue}
                    autoFocus
                    className={'datepicker-edit-input'}
                    type="text"
                    placeholder={'请选择日期'}
                    onChange={handleInputChange}
                />
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
            <Calendar
                curDate={curDate}
                rangeDate={rangeDate}
                handleCellClick={handleCellClick} />
            <hr />
            <footer
                className={'action-wrapper'}
                onClick={handleFooterClick}>
                    <span className={'action-wrapper-text'}>今天</span>
            </footer>
        </div>
    );
}

const DatePicker: React.FC<{ value?: string; placeholder?: string; onDateChange?: (date: string, dateForMoment: moment.Moment) => any }> = ({value, placeholder, onDateChange}) => {
    const [visible, setVisible] = useState(false);
    const [inputValue, setInputValue] = useState(value || '');

    const _setInputValue = (date: string, dateForMoment: moment.Moment) => {
        setInputValue(date);
        typeof onDateChange === 'function' && onDateChange(date, dateForMoment);
    };

    const ref = React.useRef(null);
    const hidePicker = (e) => {
        if (ref && ref.current === e.target) return;
        setVisible(false);
    };

    useEffect(() => {
        window.addEventListener('click', hidePicker);
        return () => window.removeEventListener('click', hidePicker);
    });

    return (
        <div className={'react-datepicker-wrapper'}>
            <input
                ref={ref}
                className={'react-datepicker-input'}
                type="text"
                value={value || inputValue}
                readOnly
                onClick={() => setVisible(true)}
                placeholder={placeholder || '请选择日期'}
            />
            <div>
                {visible && <Picker
                    setInputValue={_setInputValue}
                    inputValue={value || inputValue}
                    hidePicker={hidePicker}
                />}
            </div>

        </div>
    )
}

export default DatePicker;