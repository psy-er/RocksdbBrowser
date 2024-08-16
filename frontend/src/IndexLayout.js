import React, { useState } from 'react';
import './IndexLayout.css'
import WithNavbar from './WithNavbar';

import Item1Content from './Item1Content';
import Item2Content from './item2Content';
import Item3Content from './Item3Content';
import FileForm from './components/FileForm';
import FileList from './components/FileList';
import DataViewer from './components/DataViewer';

const IndexLayout = () => {

    // 인덱스 목록과 각 인덱스에 대응하는 콘텐츠
    const items = [
        {id:1, label: 'Data viewer', component: <DataViewer/>},
        {id:2, label: 'Data List', component: <FileList/>},
        {id:3, label: 'Data Insert', component: <FileForm/>}
    ];

    // 선택된 인덱스를 상태로 관리
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <WithNavbar>
        <div className="index-layout">
            <div className="index-list">
                {items.map((item, index) => (
                    <div
                        key={item.id}
                        className={`index-item ${selectedIndex === index ? 'active' : ''}`}
                        onClick={() => setSelectedIndex(index)}
                    >
                        {item.label}
                    </div>
                ))}
            </div>
            <div className="content">
                {items[selectedIndex].component}
            </div>
        </div>
        </WithNavbar>
    );
};

export default IndexLayout;