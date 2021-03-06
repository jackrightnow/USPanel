import React, {useState, useContext, useEffect} from 'react';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import AppContext from '../../context/AppContext';

import Swal from 'sweetalert2';

import doAjax from '../../libraries/doAjax';
import TableRows from './TableRows';
import TableControls from './TableControls';


export default function Panel (props) {
  const appContext = useContext(AppContext);
  const [pageId, setPageId] = useState(0);
  const [formLink, setFormLink] = useState('PanelForm');
  const [pageIdReady, setPageIdReady] = useState(0);
  const [pageData, setPageData] = useState({
    title: 'Admin Panel Modülleri'
  })
  const [crudData, setCrudData] = useState({
    table: 'panel',
    sayfaNo: 1, 
    kacar: 15,
    sayfaSayisi: 0,
    toplam: 0,
  })
  const [crudColumns, setCrudColumns] = useState([])
  const [crudList, setCrudList] = useState([])

  useEffect(()=>{
    const parsed = queryString.parse(location.search);
    //console.log(parsed);
    if(!parsed.id){   //eger yukari gidilirse alt sayfaya bakmasin
      setPageId(x=> (x = 0));
      setPageIdReady(x => (1));   // page id degeri atandiktan sonra ajax cagir.  
    }
    if(parsed.id){  //eger alt sayfaya gidilirse guncelleyelim
      //console.log(parsed.id)
      setPageId(x => (x = parsed.id));
      setFormLink('panelForm?parent=' + parsed.id);
      setPageIdReady(x => (1));
    }
  })
  
  useEffect(()=>{
    if(pageIdReady == 1){
      refreshTable();
    }
  },[crudData.sayfaNo, crudData.kacar, pageId, pageIdReady]);

  
  const refreshTable = () => {
    const data = doAjax(
      appContext.api_url + 'Admin/Panel/getListData',
      'GET',
      {
        pageId: pageId, 
        table: crudData.table,
        sayfaNo: crudData.sayfaNo,
        kacar: crudData.kacar,
        sayfaSayisi: crudData.sayfaSayisi,
        toplam: crudData.toplam,
        orderby: 't.count',
        orderType: 'asc',
      }
    );
    data.then((res)=>{
      const gelen = JSON.parse(res);
      setCrudColumns(x => (x = gelen.crudColumns));
      setCrudList(x => (x = gelen.crudList));
      setCrudData(x => ({...crudData, ...gelen.crudData}))
    })
  }
  const yenile = (e) => {
    e.preventDefault();
    refreshTable();
  }
  const yukari = (e) => {
    e.preventDefault();
    const data = doAjax(
      appContext.api_url + 'Admin/Panel/findPageParent',
      'GET',{pageId: pageId, table: crudData.table }
    );
    
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      //console.log(gelen);
      if(gelen.secilenPage){
        let yonlendirilecekUrl = 'panel';
        let panelFormLinki = 'panelForm';
        if(gelen.secilenPage.parent > 0){
          yonlendirilecekUrl += '?id=' + gelen.secilenPage.parent;
          panelFormLinki += 'PanelForm?parent=' + gelen.secilenPage.parent;
        }
        setFormLink(panelFormLinki);
        props.history.push(yonlendirilecekUrl);
      }
    })
  }
  const crudGoNextPage = () => {
    console.log(crudData)
    if(crudData.sayfaNo < crudData.sayfaSayisi){
      setCrudData({...crudData, sayfaNo: crudData.sayfaNo + 1})
    }
  }
  const crudGoPrevPage = () => {
    if(crudData.sayfaNo > 1){
      setCrudData({...crudData, sayfaNo: crudData.sayfaNo - 1})
    }
  }
  const crudGoLastPage = () => {
    setCrudData({...crudData, sayfaNo: crudData.sayfaSayisi})
  }
  const crudGoFirstPage = () => {
    setCrudData({...crudData, sayfaNo: 1})
  }
  const crudSayfaNoChange = (e) => {
    setCrudData({...crudData, sayfaNo: parseInt(e.target.value) })
  }
  const kacarChange = (e) => {
    setCrudData({...crudData, kacar: parseInt(e.target.value), sayfaNo: 1 })
  }
  const deleteRow = (e, itemId) => {
    e.preventDefault();
    let c = confirm('Tablo ve içindeki tüm veriler silinecek. Emin misiniz?');
    if(!c) return false;
    const data = doAjax(
      appContext.api_url + 'ApiPanel/deleteRow',
      'POST',
      {
        itemId: itemId
      }
    );
    data.then((res)=>{
      //console.log(res);      
      const gelen = JSON.parse(res);
      if(gelen.sonuc == 'ok'){
        Swal.fire({
          icon: 'success',
          title: 'İşlem Başarılı',
          text: gelen.aciklama,
          showConfirmButton: false,
          allowOutsideClick: false,
          timer:1000
        })
        refreshTable()
      }
    })
  }

  //console.log(crudColumns);    
  return (
    <div className="page-content">      
      <div className="page-title">
        <div className="icon">
          <i className="fa fa-user"></i>
        </div>
        <div className="desc">{pageData.title}</div>
      </div>
      <div className="page-filter"></div>
      <div className="page-list">
        <div className="list-control">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={formLink} className="addBtn">Ekle</Link>
            {(pageId>0?<a href="#" onClick={yukari} className="refreshBtn">Yukarı Git</a>:null)}            
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} 
              kacarChange={kacarChange} 
              crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage}
              crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} 
              crudSayfaNoChange={crudSayfaNoChange}
            />  
          </div>
        </div>
        <div className="list-table">          
          <table>
            <thead>
              <tr>
                {crudColumns.map((value, key)=>{
                    if(value.show_in_crud == 1){
                      return <th key={key}>{value.title}</th>
                    }
                  })}
              </tr>
            </thead>
            <tbody>
              <TableRows crudColumns={crudColumns} crudList={crudList} crudData={crudData} deleteRow={deleteRow} />
            </tbody>
          </table>
        </div>

        <div className="list-control bottom">
          <div className="control-left">
            <a href="#" onClick={yenile} className="refreshBtn">Yenile</a>
            <Link to={formLink} className="addBtn">Ekle</Link>
          </div>
          <div className="control-right">
            <TableControls crudData={crudData} 
              kacarChange={kacarChange} 
              crudGoFirstPage={crudGoFirstPage} crudGoPrevPage={crudGoPrevPage}
              crudGoNextPage={crudGoNextPage} crudGoLastPage={crudGoLastPage} 
              crudSayfaNoChange={crudSayfaNoChange}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
