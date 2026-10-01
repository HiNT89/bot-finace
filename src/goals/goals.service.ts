import { Injectable } from "@nestjs/common"; import { InjectRepository } from "@nestjs/typeorm"; import { Repository } from "typeorm"; import { GoalType, TargetType } from "../common/enums"; import { Goal } from "../database/entities";
@Injectable()
export class GoalsService {
  constructor(@InjectRepository(Goal) private readonly goals: Repository<Goal>) {}
  create(userId: string, name: string, type: GoalType, targetType: TargetType, targetValue: number, startDate: string, endDate: string) { return this.goals.save(this.goals.create({ userId, name, type, targetType, targetValue: String(targetValue), startDate, endDate })); }
  active(userId: string, date: string) { return this.goals.createQueryBuilder("g").where("g.userId = :userId AND g.startDate <= :date AND g.endDate >= :date", { userId, date }).getMany(); }
}
