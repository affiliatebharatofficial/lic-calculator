/**
 * Grounded Mock AI Provider (Deterministic Offline Fallback & Testing Engine)
 */

import type {
  AIProvider,
  AIResponse,
  ExplanationRequest,
  ChatRequest,
  FieldExplanationRequest,
  StructuredExplanation,
  StructuredChatAnswer
} from '../types';
import { LOCALIZED_CALCULATOR_OVERLAYS } from '@/lib/seo/calculator-i18n';
import type { Locale } from '@/types/i18n';

export class MockAIProvider implements AIProvider {
  public readonly providerType = 'mock';
  public readonly model = 'mock-grounded-v1';

  public async generateExplanation(
    request: ExplanationRequest
  ): Promise<AIResponse<StructuredExplanation>> {
    const startTime = Date.now();

    const whatNumbersMean = (request.breakdownItems || []).map((item) => ({
      label: item.label,
      amount: item.amount,
      meaning: item.notes || `Authoritative figure of ${item.amount} computed for ${item.label}.`,
      category: 'base'
    }));

    const isSurrender = request.calculatorId.includes('surrender');
    const isMaturity = request.calculatorId.includes('maturity') || request.calculatorId.includes('bonus');
    const isPremium = request.calculatorId.includes('premium');
    const isLoan = request.calculatorId.includes('loan');

    let summary = `Your estimated calculation for ${request.calculatorId} is ${request.primaryResult}.`;
    let howCalculated = 'Calculated using verified actuarial table formulas and statutory policy parameters.';

    if (isSurrender) {
      summary = `Your estimated cash surrender payout is ${request.primaryResult}. This calculation compares statutory Guaranteed Surrender Value (GSV) against Special Surrender Value (SSV) and selects the higher payable amount.`;
      howCalculated = 'Evaluated via statutory GSV (minimum guaranteed percentage of eligible premiums) and SSV (discounted paid-up value). LIC pays the higher amount.';
    } else if (isMaturity) {
      summary = `Your projected lump-sum maturity return is ${request.primaryResult}, combining your guaranteed Sum Assured with accrued reversionary and terminal bonuses.`;
      howCalculated = 'Calculated as Sum Assured plus cumulative annual Simple Reversionary Bonuses plus Final Additional Bonus (FAB) for qualifying policy terms.';
    } else if (isPremium) {
      summary = `Your estimated premium installment is ${request.primaryResult}. This includes tabular rates, modal rebates, high sum assured discounts, and applicable GST.`;
      howCalculated = 'Computed by taking base tabular rate per ₹1,000 SA, deducting mode and high SA rebates, and adding statutory GST.';
    } else if (isLoan) {
      summary = `Your maximum eligible policy loan is ${request.primaryResult}, computed against your policy cash surrender value.`;
      howCalculated = 'Computed as 90% of surrender value for active in-force policies (or 80% for paid-up policies) at prevailing declared interest rates.';
    }

    const data: StructuredExplanation = {
      summary,
      whatNumbersMean,
      howCalculated,
      keyAssumptions: request.assumptions && request.assumptions.length > 0
        ? request.assumptions
        : ['Assumes standard healthy life and uninterrupted premium schedule.'],
      importantWarnings: request.warnings && request.warnings.length > 0
        ? request.warnings
        : ['Actual payable figures depend on official LIC branch records and policy endorsement status.'],
      whatToVerify: [
        'Check policy commencement date on your original policy document.',
        'Verify total number of completed premium installments on your latest premium receipt.',
        'Confirm whether any policy loan or nomination liens currently exist.'
      ],
      sources: request.sourceReference ? [request.sourceReference] : ['Verified Rule Database']
    };

    return {
      success: true,
      data,
      meta: {
        provider: this.providerType,
        model: this.model,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }

  public async answerQuestion(
    request: ChatRequest
  ): Promise<AIResponse<StructuredChatAnswer>> {
    const startTime = Date.now();
    const rawMsg = request.message || '';
    const query = rawMsg.toLowerCase();

    // 1. Check if this is a translation prompt
    if (query.includes('translate the following lic calculator content') || query.includes('faqs to translate') || query.includes('return a valid json object matching this schema')) {
      // Find target locale from message
      const locMatch = rawMsg.match(/in (HI|MR|GU|BN|TA|TE)/i) || rawMsg.match(/spoken (HI|MR|GU|BN|TA|TE)/i);
      const targetLoc = (locMatch ? locMatch[1].toLowerCase() : 'hi') as Locale;

      // Extract calculator tool ID hint if present
      let matchedToolId = 'lic-surrender-value-calculator';
      if (rawMsg.includes('Maturity') || rawMsg.includes('Returns')) matchedToolId = 'lic-maturity-calculator';
      else if (rawMsg.includes('Premium') || rawMsg.includes('Mode Rebate')) matchedToolId = 'lic-premium-calculator';
      else if (rawMsg.includes('Bonus') || rawMsg.includes('Accrual')) matchedToolId = 'lic-bonus-calculator';
      else if (rawMsg.includes('Loan') || rawMsg.includes('Interest')) matchedToolId = 'lic-loan-calculator';
      else if (rawMsg.includes('Paid-Up Analysis') || rawMsg.includes('Surrender vs')) matchedToolId = 'lic-surrender-analysis';
      else if (rawMsg.includes('Loss Calculator') || rawMsg.includes('Shortfall')) matchedToolId = 'lic-surrender-loss-calculator';
      else if (rawMsg.includes('Pension') || rawMsg.includes('Annuity')) matchedToolId = 'lic-pension-calculator';
      else if (rawMsg.includes('Term Insurance') || rawMsg.includes('Pure Protection')) matchedToolId = 'lic-term-insurance-calculator';

      const overlay = LOCALIZED_CALCULATOR_OVERLAYS[targetLoc]?.[matchedToolId as any] || LOCALIZED_CALCULATOR_OVERLAYS['hi']?.[matchedToolId as any];

      const jsonResp = {
        h1: overlay?.h1 || 'कैलकुलेटर',
        subtitle: overlay?.subtitle || 'पॉलिसी विवरण',
        metaDescription: overlay?.metaDescription || 'ऑनलाइन गणना',
        faqs: overlay?.faqs || []
      };

      return {
        success: true,
        data: {
          answer: JSON.stringify(jsonResp, null, 2),
          keyPoints: ['Deterministic localized translation mock response'],
          assumptions: [],
          sources: ['Localized Knowledge Repository'],
          suggestedFollowUps: []
        },
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    }

    if (query.includes('translate this faq') || query.includes('question:') && query.includes('answer:')) {
      const locMatch = rawMsg.match(/in (HI|MR|GU|BN|TA|TE)/i);
      const targetLoc = (locMatch ? locMatch[1].toLowerCase() : 'hi') as Locale;

      const qMatch = rawMsg.match(/Question:\s*(.+)/i);
      const aMatch = rawMsg.match(/Answer:\s*(.+)/i);
      const origQ = qMatch ? qMatch[1].trim() : '';
      const origA = aMatch ? aMatch[1].trim() : '';

      const jsonResp = {
        question: `[${targetLoc.toUpperCase()}] ${origQ}`,
        answer: `[${targetLoc.toUpperCase()}] ${origA}`
      };

      return {
        success: true,
        data: {
          answer: JSON.stringify(jsonResp, null, 2),
          keyPoints: ['FAQ Translation Response'],
          assumptions: [],
          sources: ['Localized FAQ Repository'],
          suggestedFollowUps: []
        },
        meta: {
          provider: this.providerType,
          model: this.model,
          latencyMs: Date.now() - startTime,
          timestamp: new Date().toISOString()
        }
      };
    }

    let answer = 'LIC Calculator provides independent, deterministic mathematical evaluations for LIC policies. How can I help you understand your policy parameters?';
    let keyPoints = [
      'All calculations are powered by deterministic formulas and verified rule tables.',
      'We do not provide personalized financial advice.'
    ];
    let suggestedFollowUps = [
      'How is surrender value calculated?',
      'What is a paid-up policy?',
      'How does policy loan interest work?'
    ];

    if (query.includes('surrender') && query.includes('paid up')) {
      answer = 'Surrendering terminates your policy immediately for a discounted cash payout today. Converting to Paid-Up stops future premium payments while retaining a reduced life cover and full payout of accumulated benefits at maturity.';
      keyPoints = [
        'Surrender = Immediate cash in hand, but life cover stops and capital loss occurs.',
        'Paid-Up = Stop paying premiums, maintain reduced cover, receive money at maturity without early penalty.'
      ];
      suggestedFollowUps = ['Compare Surrender vs Paid-Up', 'What is Special Surrender Value?'];
    } else if (query.includes('surrender')) {
      answer = 'Surrender value is the cash amount paid by LIC if you voluntarily terminate your policy before maturity. Under LIC rules, policies acquire cash surrender value only after completing at least 2 full years of paid premiums.';
      keyPoints = [
        'Requires minimum 2 completed policy years.',
        'LIC pays the higher of Guaranteed Surrender Value (GSV) or Special Surrender Value (SSV).'
      ];
      suggestedFollowUps = ['Why is surrender value lower than total premiums paid?', 'How can I take a policy loan instead?'];
    } else if (query.includes('loan')) {
      answer = 'You can borrow up to 90% of your policy acquired surrender value (80% for paid-up policies) without forfeiting your life insurance cover or bonuses.';
      keyPoints = [
        'Interest rate is declared by LIC (currently ~9.50% p.a. payable semi-annually).',
        'Repaying principal is optional during the term; unpaid balance is settled against maturity proceeds.'
      ];
      suggestedFollowUps = ['What is the interest rate on LIC policy loans?', 'How much loan can I get on Table 914?'];
    } else if (query.includes('bonus') || query.includes('fab')) {
      answer = 'Simple Reversionary Bonus is declared annually by LIC per ₹1,000 Sum Assured based on actuarial valuations. Final Additional Bonus (FAB) is an additional terminal loyalty addition paid on long-term policies (terms of 15+ years).';
      keyPoints = [
        'Reversionary bonus vests once declared and accumulates until maturity or death.',
        'FAB is payable only once at policy conclusion for qualifying tenures.'
      ];
      suggestedFollowUps = ['How is maturity value calculated?', 'Is bonus guaranteed every year?'];
    }

    const data: StructuredChatAnswer = {
      answer,
      keyPoints,
      assumptions: ['Informational explanation based on standard LIC policy rules.'],
      sources: ['LIC Policy Guidelines & Circulars'],
      suggestedFollowUps
    };

    return {
      success: true,
      data,
      meta: {
        provider: this.providerType,
        model: this.model,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }

  public async explainField(
    request: FieldExplanationRequest
  ): Promise<AIResponse<string>> {
    const startTime = Date.now();
    const field = (request.fieldName || '').toLowerCase();

    let explanation = `Field '${request.fieldName}' is a standard parameter used in LIC policy calculations.`;

    if (field.includes('sumassured') || field.includes('cover')) {
      explanation = 'Sum Assured is the guaranteed minimum life insurance coverage amount payable to nominees in the event of death or to the policyholder upon policy maturity.';
    } else if (field.includes('policyterm') || field.includes('term')) {
      explanation = 'Policy Term is the total number of years from policy commencement until the policy reaches final maturity.';
    } else if (field.includes('completedyears') || field.includes('duration')) {
      explanation = 'Completed Years is the exact number of full policy years for which all scheduled premium installments have been paid.';
    } else if (field.includes('totalpremiums') || field.includes('paid')) {
      explanation = 'Total Premiums Paid is the sum total of all base premium installments deposited into the policy to date, excluding taxes (GST) and rider premiums.';
    } else if (field.includes('bonus')) {
      explanation = 'Accrued Reversionary Bonus represents the cumulative yearly bonuses already declared by LIC and attached to your policy, as stated on your premium receipts.';
    }

    return {
      success: true,
      data: explanation,
      meta: {
        provider: this.providerType,
        model: this.model,
        latencyMs: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };
  }
}
