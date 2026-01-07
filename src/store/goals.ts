import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Contribution, Goal } from "../types/goals";
export interface GoalStore{
goals:Goal[];
addGoal:(goal:Goal)=>void;
addContribution:(goalId:string,contribution:Contribution)=>void;
}
export const useGoalsStore=create<GoalStore>()(persist(((set)=>({
    goals:[],
    addGoal:(goal)=>set((state)=>({goals:[...state.goals,{...goal,id:crypto.randomUUID(),contributions:[]}]})),
    addContribution:(goalId,contribution)=>set((state)=>({goals:state.goals.map((goal)=>goalId===goal.id?{
        ...goal,contributions:[...goal.contributions,{...contribution,id:crypto.randomUUID()}]
    }:goal)}))
})),{name:"goal-storage"}))