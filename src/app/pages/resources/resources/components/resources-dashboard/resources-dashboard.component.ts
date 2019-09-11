import { Component, OnInit } from '@angular/core';
import { ResourcesService } from '../../../resources.service';

import { FiltersService, CitiesCountiesService } from '../../../../../core/service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthenticationService } from '@app/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-resources-dashboard',
	templateUrl: './resources-dashboard.component.html',
	styleUrls: ['./resources-dashboard.component.scss']
})
export class ResourcesdashboardComponent implements OnInit {
	resourcesData: any[] = [];
	pager: any = {};
	displayBlock = false;
	categoryFilterValues: any[] = [];
	subcategoryFilterValues: any[] = [];
	locationFilterValues: any[] = [];
	navigationExtras: any;
	selected = new Array(2);
	selectedcat: any[];
	selectedloc: any[];
	propertyMap = {
		'_id': 'id',
		'parent_id': 'parent_id'
	};
	constructor(private resourceService: ResourcesService,
		private filterService: FiltersService,
		private citiesandCounties: CitiesCountiesService,
		public breakpointObserver: BreakpointObserver,
		public authService: AuthenticationService,
		private router: Router) { }

	ngOnInit() {
		this.pager = this.resourceService.getPager();

		this.getData();

		this.filterService.getCategoryFilters().subscribe((data) => {
			this.categoryFilterValues = data.map((x: any) => {
				const parent = data.find((y: any) => y._id === x.parent_id);
				return {
					id: x._id,
					name: x.name,
					parent_id: x.parent_id,
					pp: x.parent_id === '0' ? x.name : ( parent ? parent.name : null),
					level: x.parent_id === '0' ? 0 : 1
				};
			});
		});

		this.citiesandCounties.getCounties('').subscribe((response: any) => {
			const aux = response;
			aux.map((elem: { id: any; _id: any; }) => elem.id = elem._id);
			this.locationFilterValues = aux;
		});

		this.breakpointObserver
			.observe(['(max-width: 768px)'])
			.subscribe(result => {
				if (result.matches) {
					this.switchtoblock();
				}
			});
	}

	getData() {
		this.resourceService.getResources(this.pager).subscribe((data) => {
			this.resourcesData = data.data;
			this.pager.total = data.pager.total;
		});
	}

	addresource() {
		if (this.authService.is('NGO')) {
			const navigationExtras = {
				state: {
					ngo: {
						// TO-DO: extragere informatiilor din contu utilizatorului
						name: this.authService.user.organisation.name,
						ngoid: this.authService.user.organisation._id
					}
				}
			};
			this.router.navigateByUrl('/resources/add', navigationExtras);
		} else {
			this.router.navigate(['resources/add']);
		}
	}
	sortChanged(pager: any) {
		this.pager = pager;
		this.getData();
	}
	searchChanged(pager: any) {
		this.pager = pager;
		this.getData();
	}
	loadData = function(event: any) {
		const filter = event.filter;
		console.log(filter);
	};

	filterChanged(id?: number) {
		console.log(this.selected);
		this.pager.filters[id] = this.selected[id].map((elem: any) => elem.id).join(',');
		this.getData();
	}

	switchtolist() {
		this.displayBlock = false;
	}

	/**
	 * set class of display element with grid view
	 */
	switchtoblock() {
		this.displayBlock = true;
	}
}
