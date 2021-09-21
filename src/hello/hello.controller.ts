import { Controller, Logger, Get, NotFoundException, Param, Post, Body } from "@nestjs/common";
import { HelloBodyDTO } from "./hello-body.dto";
import { v4 as uuid } from "uuid";
import {HelloService} from "./hello.service"

@Controller()
export class HelloController {
  /* a logger from nestjs for logging error/other info */
  logger: Logger = new Logger(HelloController.name);
  /* just create a contructor arg and set the type as the provider
           & that's gonna do the work
       */
  constructor(private readonly helloService: HelloService){}
  db: { id: string, message: string }[] = []; // temporary database

  @Get("hello")
  async replyHello() {
    try {
      return await this.helloService.fetch()
    } catch (error) {
      this.logger.error(error?.message ?? "");
      throw error;
    }
  }

  @Get("hello/:helloId") // dyanmic parameter just like express, koa-router etc...
  async replyExactHello(
    /*pass the same dynamic parameter from "hello/:helloId" in
      @Param decorator's first to let nestjs find the parameter
      correctly
    */
    @Param("helloId") id: string
  ) {
    try {
      /*returning the correct temp hello message*/
      /*using provider's methods*/
      const message = (await this.helloService.find(id))?.message;
      if(!message) throw new NotFoundException("desired `hello` not found") //404 error
      return message;
    } catch (error) {
      /* will log the error & autmatically send the error as response with all required data */
      this.logger.error(error?.message ?? "");
      throw error;
    }
  }

  // decorator name is similar to http verbs e.g. POST -> @Post
  @Post("hello")
  async saveHello(
    /*Just pass the class as a type & the validation will be done automatically*/
    @Body() body: HelloBodyDTO
  ) {
    try {
      /* creating `hello` using the provider HelloService */
      return await this.helloService.create(body.message)
    } catch (error) {
      this.logger.error(error?.message ?? "");
      throw error;
    }
  }
}
