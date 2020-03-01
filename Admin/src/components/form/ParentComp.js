import React, {useState, useContext, useEffect} from 'react';
import propTypes from 'prop-types';
import Select from './Select';
import doAjax from '../../libraries/doAjax';
import AppContext from '../../context/AppContext';


export default function ParentComp (props) {
  const {parentPath, pageReady, formId} = props;
  const appContext = useContext(AppContext);

  const [parentPathList, setParentPathList] = useState([]);
  //console.log(props);
  useEffect(()=>{
    //console.log("güncellendi");
    if(pageReady == 1){
      //console.log(props);
      
      //console.log(parentPath);
      const data = doAjax(
        appContext.api_url + 'ApiPanel/getParentList',
        'GET',
        {parentPath: parentPath}
      );
      data.then((res)=>{
        //console.log(res);
        const gelen = JSON.parse(res);
        if(gelen.parentPathList){
          //console.log(gelen.parentPathList);
          
          setParentPathList(gelen.parentPathList);
        }
      })
    }
  },[props.parentPath , props.pageReady]);

  const parentWrapper = parentPathList.map((liste, keyl)=>{
    //console.log(liste);
    
    liste = liste.filter((item) => item.id !== formId );
    //console.log(parentPath[keyl+1]);
    
      return (
        <Select key={keyl} name={'parent_path'} value={parentPath[keyl+1]} inputList={liste} onChange={(e)=>props.onChangeParent(e, keyl)} itemKeyValue="id" itemKeyName="title" defaultValue={0} hasDefault={1} />
      )
    //}
  })
    
  
  return(
    <div className="parentComp">
      {parentWrapper}
    </div>

  )
}


ParentComp.propTypes = {
  parentPath: propTypes.array
}