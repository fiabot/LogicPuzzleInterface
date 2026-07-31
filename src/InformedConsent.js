import * as React from 'react';
import FailedConsent from './FailedConsent';

const ConsentViewer =({ consent }) => {
    let [rejected, setRejected] = React.useState(false);

    if (!rejected){
      return (
      
        <div className='consent'>
            <p>Consent to the study</p>
            <button onClick={consent}>I agree, and confirm that I am 18+, fluent in English, and located in the United States.</button>
        </div>
       )
        ;
    }else{
      return <FailedConsent/> 
    }
   
};

export default ConsentViewer;