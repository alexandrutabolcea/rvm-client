import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
@Injectable({
		providedIn: 'root'
	})
export class ResourcesService {
	constructor(private httpClient: HttpClient) {}
	/**
	 * get all Resources
	 */
	getResources(paginationObj?: any): Observable<any> {
		let params = {};
		params = {...params, ...paginationObj};
		return this.httpClient.get('/resources', { params: params });
	}
	/**
	 * get Resource by id
	 */
	getResource(id: String): Observable<any> {
		return this.httpClient.get(`/resources/${id}` );
	}
	/**
	 * Add resource
	 */
	addResource(payload: any) {
		return this.httpClient.post('/resources', payload );
	}
	getOrganizationbyResources(id: String): Observable<any> {
		
			let params = {};
			params = {...params, ...{name: name}};
			return this.httpClient.get('/resources/organisations', {params: params} );
		}
		// return this.httpClient.get(`/organisations/${id}` );
	// }
}
