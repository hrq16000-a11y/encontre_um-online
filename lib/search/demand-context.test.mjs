import { test } from "node:test";
import assert from "node:assert/strict";
import { demandContext, confirmedDemand } from "./demand-context.ts";

const categories = [{slug:"eletricista", name:"Eletricista"}];

test("uses the visitor's query and city, then verified category, never a made-up service", () => {
  assert.deepEqual(demandContext(" Wi-Fi ", "eletricista", categories, " Curitiba "), {query:"Wi-Fi", city:"Curitiba"});
  assert.deepEqual(demandContext("", "eletricista", categories, ""), {query:"Eletricista", city:""});
  assert.deepEqual(demandContext("", "unknown", categories, "Curitiba"), {query:"", city:"Curitiba"});
  assert.deepEqual(demandContext("", "", categories, "Curitiba"), {query:"", city:"Curitiba"});
});

test("only 201 with explicit confirmation and message means persisted", () => {
  assert.equal(confirmedDemand(201, {ok:true, message:"Recebemos sua procura."}), true);
  for (const [status, body] of [[202,{ok:true}], [200,{ok:true,message:"ok"}], [500,{ok:true,message:"ok"}], [201,{ok:false,message:"erro"}], [201,{ok:true,message:" "}], [201,null]]) {
    assert.equal(confirmedDemand(status, body), false);
  }
});
