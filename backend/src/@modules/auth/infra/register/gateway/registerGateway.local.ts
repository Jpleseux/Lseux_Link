import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { UserEntity } from "@modules/auth/core/register/entities/user.entity";
import * as jwt from "jsonwebtoken";
import { RegisterGatewayInterface } from "@modules/auth/core/register/registerGateway.interface";
import { apiError } from "../../../../../http/nestjs/helpers/api-Error.helper";
const segredo = "3cba50ad-324e-4f26-9bb9-3304bfc2c30e";
export class RegisterGatewayLocal implements RegisterGatewayInterface {
  constructor(readonly datasorce: DataSource) {}
  async validateCpf_cnpj(input: string): Promise<boolean> {
    if (input.replace(/[\s.-]*/gim, "").length === 11) {
      if (typeof input !== "string") return false;
      const cpf = input.replace(/[\s.-]*/gim, "");
      if (
        !cpf ||
        cpf.length != 11 ||
        cpf == "00000000000" ||
        cpf == "11111111111" ||
        cpf == "22222222222" ||
        cpf == "33333333333" ||
        cpf == "44444444444" ||
        cpf == "55555555555" ||
        cpf == "66666666666" ||
        cpf == "77777777777" ||
        cpf == "88888888888" ||
        cpf == "99999999999"
      ) {
        return false;
      }
      let soma = 0;
      let resto;
      for (let i = 1; i <= 9; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto == 10 || resto == 11) resto = 0;
      if (resto != parseInt(cpf.substring(9, 10))) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if (resto == 10 || resto == 11) resto = 0;
      if (resto != parseInt(cpf.substring(10, 11))) return false;
      return true;
    } else if (input.replace(/[^\d]+/g, "").length === 14) {
      const cnpj = input.replace(/[^\d]+/g, "");
      if (cnpj.length !== 14) return false;
      let tamanhoTotal = cnpj.length - 2;
      let cnpjSemDigitos = cnpj.substring(0, tamanhoTotal);
      const digitosVerificadores = cnpj.substring(tamanhoTotal);
      let soma = 0;
      let pos = tamanhoTotal - 7;
      for (let i = tamanhoTotal; i >= 1; i--) {
        soma += parseInt(cnpjSemDigitos.charAt(tamanhoTotal - i), 10) * pos--;
        if (pos < 2) pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== parseInt(digitosVerificadores.charAt(0), 10)) return false;

      tamanhoTotal = tamanhoTotal + 1;
      cnpjSemDigitos = cnpj.substring(0, tamanhoTotal);
      soma = 0;
      pos = tamanhoTotal - 7;

      for (let i = tamanhoTotal; i >= 1; i--) {
        soma += parseInt(cnpjSemDigitos.charAt(tamanhoTotal - i), 10) * pos--;
        if (pos < 2) pos = 9;
      }

      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== parseInt(digitosVerificadores.charAt(1), 10)) return false;

      return true;
    }
    return false;
  }
  async validateEmail(email: string): Promise<string | boolean> {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
      ? email
      : false;
  }
  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  }
  async tokenGenerate(input: UserEntity): Promise<string> {
    const token = jwt.sign(input.payloadToken(), segredo);
    return token;
  }
  async tokenDecoding(token: string): Promise<any> {
    try {
      const payload = jwt.verify(token, segredo);
      return payload;
    } catch (error) {
      throw new apiError("Token inválido", 401, "not_authorized");
    }
  }
}
