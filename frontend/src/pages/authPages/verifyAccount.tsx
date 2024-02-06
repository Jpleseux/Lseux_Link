import React, { ChangeEvent, useEffect, useState } from 'react';
import Input from '../../components/forms/input';
import { useParams } from 'react-router';

function VerifyAccount() {
  const [token, setToken] = useState<string | undefined>('');
  const {tokenParam} = useParams();
  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setToken(e.target.value);
  }
  useEffect(() => {
    setToken(tokenParam);
  })
  return (
    <div>
      <form>
        <Input handleOnChange={handleOnChange} value={token} name='token' type='text' placeholder='Insira seu token' />
      </form>
    </div>
  );
}

export default VerifyAccount;
