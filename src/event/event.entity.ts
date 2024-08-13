import { Entity ,Property, OneToMany, ManyToMany, ManyToOne, Collection, Cascade} from "@mikro-orm/core";
import { BaseEntity } from "../shared/db/baseEntity.entity.js";
import { EventAddress } from "./eventAddress.entiry.js";

export class Event extends BaseEntity{
  @Property({nullable:false})
  name!: string

  @Property({nullable:false})
  description! : string

  @Property({nullable:false})
  total_capacity!: number

  @ManyToOne(()=> EventAddress,{nullable:false})
  eventAddress! : EventAddress

  @Property({nullable:false})
  start_date_time! : string

  @Property({nullable:false})
  finish_date_time!: string

  @Property({nullable:false})
  min_age! : number


}
