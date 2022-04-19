import { Injectable } from "@angular/core";
@Injectable()
export class ManagementFilters {
    public policyTypeFilters: any = [
        {
            key: 1, value: 'Active'
        },
        {
            key: 2, value: 'Pending',
        },
        {
            key: 3, value: 'Active/Pending',
        },
        {
            key: 4, value: 'Terminated',
        },
        {
            key: 5, value: 'Deleted',
        },
        {
            key: 6, value: 'All'
        }
    ];
    public Mode: any = [
        {
            key: 0, value: 'Monthly',
        },
        {
            key: 1, value: 'Quarterly',
        },
        {
            key: 2, value: 'Semi Annually',
        },
        {
            key: 3, value: 'Annually'
        },
        {
            key: 4, value: 'One Time'
        },
        {
            key: 5, value: 'Random'
        },
        {
            key: 6, value: 'All'
        },

    ];
    public OrderBy: any = [
        {
            key: 1, value: 'None',
        },
        {
            key: 2, value: 'Client/Insured',
        },
        {
            key: 4, value: 'Payor',
        },
        {
            key: 5, value: 'Carrier'
        },
        {
            key: 6, value: 'Product'
        },
        {
            key: 7, value: 'Payee'
        },
        {
            key: 7, value: 'Effective'
        },
        {
            key: 7, value: 'Enrolled'
        },
        {
            key: 7, value: 'Track From'
        }

    ];
    public TrackPayment: any = [
        {
            key: 0, value: 'Yes',
        },
        {
            key: 1, value: 'No',
        },
        {
            key: 2, value: 'Both',
        }

    ];
    public EffectiveMonth: any = [
        {
            key: 0, value: 'Any',
        },
        {
            key: 1, value: 'Jan',
        },
        {
            key: 2, value: 'Feb',
        },
        {
            key: 3, value: 'Mar',
        },
        {
            key: 4, value: 'Apr',
        },
        {
            key: 5, value: 'May',
        },
        {
            key: 6, value: 'Jun',
        },
        {
            key: 7, value: 'Jul',
        },
        {
            key: 8, value: 'Aug',
        },
        {
            key: 9, value: 'Sep',
        },
        {
            key: 10, value: 'Oct',
        },
        {
            key: 11, value: 'Nov',
        },
        {
            key: 12, value: 'Dec',
        },
        {
            key: 13, value: 'blank',
        }

    ];
    public TermReason: any = [
        {
            key: 5, value: 'All',
        },
        {
            key: 0, value: 'Replaced by new policy',
        },
        {
            key: 1, value: 'Lost by competitor',
        },
        {
            key: 2, value: 'Voluntary',
        },
        {
            key: 3, value: 'Out of business',
        },
        {
            key: 4, value: 'Non-Payment',
        }

    ];
}
