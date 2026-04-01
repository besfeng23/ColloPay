'use server';
/**
 * @fileOverview This file implements a Genkit flow that allows internal administrators
 * to generate custom reports and insights by providing natural language queries.
 * The AI interprets the query and outputs a structured report request
 * and a natural language summary of the intended report.
 *
 * - generateAdminCustomReport - A function that handles the report generation process.
 * - AdminCustomReportInput - The input type for the generateAdminCustomReport function.
 * - AdminCustomReportOutput - The return type for the generateAdminCustomReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the input schema for the natural language report query.
const AdminCustomReportInputSchema = z.object({
  naturalLanguageQuery: z.string().describe('A natural language query describing the desired report, e.g., "Show me all failed transactions for ColloPay from last month" or "What was the total volume for Partner A in Q3?".'),
});
export type AdminCustomReportInput = z.infer<typeof AdminCustomReportInputSchema>;

// Define the output schema for the structured report request and summary.
// This schema guides the LLM to extract key information from the natural language query.
const AdminCustomReportOutputSchema = z.object({
  reportType: z.string().describe('The identified type of report requested (e.g., "transactionSummary", "partnerPerformance", "merchantDetails", "feeAnalysis", "settlementOverview").'),
  summaryText: z.string().describe('A natural language summary explaining what the generated report will contain, based on the query.'),
  queryParameters: z.record(z.string(), z.any()).describe('A JSON object containing key-value pairs of extracted parameters for filtering, grouping, and metrics. Keys could be "partnerName", "merchantId", "transactionStatus", "timePeriod", "metric", etc. Values should be extracted as accurately as possible from the query.'),
});
export type AdminCustomReportOutput = z.infer<typeof AdminCustomReportOutputSchema>;

export async function generateAdminCustomReport(input: AdminCustomReportInput): Promise<AdminCustomReportOutput> {
  return adminCustomReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminCustomReportPrompt',
  input: { schema: AdminCustomReportInputSchema },
  output: { schema: AdminCustomReportOutputSchema },
  prompt: `You are an AI assistant for the ColloPay Gateway platform, designed to help internal administrators generate custom reports from a financial transaction ledger using natural language queries.
Your task is to interpret the user's natural language request and convert it into a structured report definition, along with a human-readable summary.

The platform manages various entities such as Partners, Merchants, Transactions (with statuses like 'pending', 'processing', 'succeeded', 'failed', 'reversed', 'refunded'), FeeRules, ProcessorMappings, and Settlements.
Financial amounts are stored precisely.
Time periods can be relative (e.g., "last month", "yesterday", "Q3", "year to date") or specific dates.

Based on the user's query:
1. Identify the main 'reportType'.
2. Provide a clear 'summaryText' of the report that would be generated.
3. Extract all relevant 'queryParameters' as key-value pairs. Be specific with values (e.g., convert "last month" to a structured time period if possible, identify specific partner/merchant names, transaction statuses, and requested metrics like "total volume", "count", "average").

Example queries and expected output structure:

Query: "Show me all failed transactions for ColloPay from last month"
Output:
{
  "reportType": "transactionSummary",
  "summaryText": "This report will show all transactions that failed for the partner ColloPay during the last calendar month, including details such as transaction ID, amount, and failure reason.",
  "queryParameters": {
    "transactionStatus": "failed",
    "partnerName": "ColloPay",
    "timePeriod": "lastMonth",
    "detailsRequired": true
  }
}

Query: "What was the total volume for Partner A in Q3?"
Output:
{
  "reportType": "partnerPerformance",
  "summaryText": "This report will provide the total transaction volume processed for Partner A during the third quarter of the current year.",
  "queryParameters": {
    "partnerName": "Partner A",
    "timePeriod": "Q3",
    "metric": "totalVolume"
  }
}

Query: "List all transactions exceeding $1000 for merchant ID 123 in the last 7 days."
Output:
{
  "reportType": "transactionSummary",
  "summaryText": "This report will list all individual transactions with an amount greater than $1000 for merchant ID 123 within the last 7 days.",
  "queryParameters": {
    "merchantId": "123",
    "amountGreaterThan": 1000,
    "timePeriod": "last7Days",
    "detailsRequired": true
  }
}

Query: "How many successful transactions did we have yesterday?"
Output:
{
  "reportType": "transactionSummary",
  "summaryText": "This report will provide the count of successful transactions processed yesterday.",
  "queryParameters": {
    "transactionStatus": "succeeded",
    "timePeriod": "yesterday",
    "metric": "transactionCount"
  }
}

Query: "Show me fee details for all transactions for partner 'Global Payments' in June 2023."
Output:
{
  "reportType": "feeAnalysis",
  "summaryText": "This report will provide detailed fee information for all transactions associated with the partner 'Global Payments' during June 2023.",
  "queryParameters": {
    "partnerName": "Global Payments",
    "timePeriod": "June 2023",
    "detailsRequired": true,
    "dataType": "fees"
  }
}

User Query: {{{naturalLanguageQuery}}}`,
});

const adminCustomReportFlow = ai.defineFlow(
  {
    name: 'adminCustomReportFlow',
    inputSchema: AdminCustomReportInputSchema,
    outputSchema: AdminCustomReportOutputSchema,
  },
  async (input) => {
    // Call the prompt with the natural language query.
    const { output } = await prompt(input);
    // The LLM's output is already structured according to AdminCustomReportOutputSchema.
    return output!;
  }
);
