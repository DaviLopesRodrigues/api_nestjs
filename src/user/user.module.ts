import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";

//Módulo de users
@Module({
    imports: [],
    //Definição de controller criado no módulo
    controllers: [UserController],
    providers: [],
    exports: []
})
export class UserModule { }