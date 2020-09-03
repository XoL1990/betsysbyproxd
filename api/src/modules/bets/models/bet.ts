import { Field, ObjectType } from '@nestjs/graphql';
import { Team } from './team';

@ObjectType()
export class Bet {
  @Field()
  id: number;

  @Field(() => [Team])
  teams: Team[] = [];

  @Field()
  draw: number;
}
