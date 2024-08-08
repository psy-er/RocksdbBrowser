import React, {useEffect, useState} from "react";
import "./Navbar.css";
import { Link, useLocation, matchPath } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const isOpenFileLink = matchPath({path: '/file/*'}, location.pathname);
    const isOpenDirectoryLink = matchPath({path: '/directory/*'}, location.pathname);
    const isNew = matchPath({path: '/new/rocksdb/*'}, location.pathname);
    const isDetail = matchPath({path: '/metadata/*'}, location.pathname);
    const isManual = matchPath({path: '/'}, location.pathname);

    return (
        <nav className="navbar">
            
            {/*파일 업로드*/}
            <Link to ="/file" className="nav-link" style={{textDecoration: 'none', fontSize: '0.7rem'}}>
                <div className={isOpenFileLink ? 'active' : 'inactive'}>
                    OPEN FILE
                </div>
            </Link>

            {/*디렉토리 업로드*/}
            <Link to ="/directory" className="nav-link" style={{textDecoration: 'none', fontSize: '0.7rem'}}>
                <div className={isOpenDirectoryLink ? 'active' : 'inactive'}>
                    OPEN DIRECTORY
                </div>
            </Link>

            {/*새로운 Rocksdb 생성*/}
            <Link to ="/new/rocksdb" className="nav-link" style={{textDecoration: 'none', fontSize: '0.7rem'}}>
                <div className={isNew ? 'active' : 'inactive'}>
                    NEW
                </div>
            </Link>

            {/*Rocksdb 메타데이터 확인*/}
            <Link to ="/metadata" className="nav-link" style={{textDecoration: 'none', fontSize: '0.7rem'}}>
                <div className={isDetail ? 'active' : 'inactive'}>
                    DETAIL
                </div>
            </Link>

            {/*Rocksdb 소개*/}
            <Link to ="/manual" className="nav-link" style={{textDecoration: 'none', fontSize: '0.7rem'}}>
                <div className={isManual ? 'active' : 'inactive'}>
                    MANUAL
                </div>
            </Link>
        </nav>
    );
};

export default Navbar;
