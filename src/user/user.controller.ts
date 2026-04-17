import { Body, Controller, Post } from "@nestjs/common";

//Controller users

@Controller("users")
export class UserController {

    //Post - Criação de recurso no banco
    @Post()
    //Body -> Recuperação do corpo da requisição (vindo em JSON)
    createUser(@Body() body)  {
        return {body}
     }
}