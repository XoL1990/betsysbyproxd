import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from './team'

@ObjectType()
export class Bet {
  @Field()
  id: number;

  @Field(type => [Team])
  teams: Team[] = [];

  @Field()
  draw: number;
}
